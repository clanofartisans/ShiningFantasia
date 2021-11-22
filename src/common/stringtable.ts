import iconv from 'iconv-lite';

import { lsb32 } from './bytes';

export class StringTable {
    entries: string[];

    constructor(b: Buffer) {
        this.entries = [];

        // header magic is 64 5F 6D 73 67 00 00 00 (d_msg)

        for (let i = 64; i < b.length; i++) {
            b[i] = b[i] ^ 0xff;
        }

        const numEntries = lsb32(b, 0x28);

        let addrOffset = 0x40;
        let entryOffset = addrOffset + lsb32(b, 0x1c);

        for (let i = 0; i < numEntries; i++) {
            let offset = lsb32(b, addrOffset) + entryOffset;
            let length = lsb32(b, addrOffset + 4);

            let stringLength = length - 0x28;

            // Skip null characters caused by padding.
            while (stringLength > 0 && b[offset+0x28+stringLength-1] === 0) {
                stringLength--;
            }

            const strBuf = b.slice(offset+0x28, offset+0x28+stringLength);

            // The encoding is kinda Shift_JIS, but has a lot of
            // non-standard bytes.
            const s = iconv.decode(strBuf, 'Shift_JIS').trim();
            this.entries.push(s);

            addrOffset += 8;
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
