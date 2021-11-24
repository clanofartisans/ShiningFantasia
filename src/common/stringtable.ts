import iconv from 'iconv-lite';

import { lsb16, lsb32 } from './bytes';

export class StringTable {
    // header magic is 64 5F 6D 73 67 00 00 00 (d_msg)
    static readonly magic = new Uint8Array([0x64, 0x5f, 0x6d, 0x73, 0x67, 0x00, 0x00, 0x00]);

    entries: string[];

    constructor(b: Buffer) {
        this.entries = [];

        if (b.length < StringTable.magic.length) {
            throw new Error('buffer too small');
        }

        if (b.compare(StringTable.magic, 0, StringTable.magic.length, 0, StringTable.magic.length) !== 0) {
            throw new Error('not a StringTable');
        }

        if (b.length < 64) {
            throw new Error('StringTable truncated');
        }

        const isByteSwapped = lsb16(b, 0x08) !== 1;
        const isInverted = lsb16(b, 0x0a) === 1;
        // 0xc
        // 0xe
        // 0x10
        const fileLength = lsb32(b, 0x14);
        const headerSize = lsb32(b, 0x18);
        const dataOffset = lsb32(b, 0x1c);
        const fixedLength = lsb32(b, 0x20);
        const dataSize = lsb32(b, 0x24);
        const numEntries = lsb32(b, 0x28);
        // 0x2c
        // 0x30
        // 0x34
        // 0x38
        // 0x3c

        if (fileLength !== b.length) {
            throw new Error('StringTable length is wrong');
        }

        let addrOffset = headerSize;

        if (isInverted) {
            for (let i = addrOffset; i < b.length; i++) {
                b[i] = b[i] ^ 0xff;
            }
        }

        for (let i = 0; i < numEntries; i++) {
            let offset;
            let length;

            if (fixedLength) {
                offset = addrOffset;
                length = fixedLength;
                addrOffset += fixedLength;
            } else {
                offset = lsb32(b, addrOffset) + dataOffset + headerSize;
                length = lsb32(b, addrOffset + 4);
                addrOffset += 8;
            }

            const numStrings = lsb32(b, offset);
            const entryOffset = offset;
            offset += 4;

            const strings = [];

            for (let j = 0; j < numStrings; j++) {
                let stringOffset = lsb32(b, offset) + entryOffset;
                const stringType = lsb32(b, offset + 4);
                offset += 8;

                if (stringType === 0) {
                    stringOffset += 0x1c;
                } else {
                    // Some sort of identifier?
                }

                let stringLength = 0;

                // Calculate string length.
                while (b[stringOffset + stringLength] !== 0) {
                    stringLength++;
                }

                const strBuf = b.slice(stringOffset, stringOffset + stringLength);

                // The encoding is kinda Shift_JIS, but has a lot of
                // non-standard bytes.
                const s = iconv.decode(strBuf, 'Shift_JIS').trim();
                strings.push(s);
            }

            this.entries.push(strings.join(','));
        }
    }

    get length(): number {
        return this.entries.length;
    }

    getString(stringId: number): string | null {
        if (stringId < this.entries.length) {
            return this.entries[stringId];
        }

        return null;
    }
}
