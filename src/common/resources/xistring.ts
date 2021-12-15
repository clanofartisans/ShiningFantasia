import { lsb16, lsb32 } from '../bytes';
import { decodeString } from '../string';
import { Resource } from './resource';

export class XiString extends Resource {
    // header magic is 58 49 53 54 52 49 4E 47 (XISTRING)
    static readonly magic = new Uint8Array([0x58, 0x49, 0x53, 0x54, 0x52, 0x49, 0x4E, 0x47]);

    entries: string[];

    constructor(b: Buffer) {
        super();

        this.entries = [];

        if (b.length < XiString.magic.length) {
            throw new Error('buffer too small');
        }

        if (b.compare(XiString.magic, 0, XiString.magic.length, 0, XiString.magic.length) !== 0) {
            throw new Error('not a XiString');
        }

        if (b.length < 0x38) {
            throw new Error('XiString truncated');
        }

        const headerSize = 0x38;
        const version = lsb16(b, 10);
        const numEntries = lsb32(b, 0x24);
        const stride = (version < 2) ? 4 : 12;
        const dataOffset = headerSize + numEntries * stride;

        let offset = headerSize;

        for (let i = 0; i < numEntries; i++) {
            const stringOffset = dataOffset + lsb32(b, offset);
            offset += stride;

            let stringLength = 0;

            // Calculate string length.
            while (b[stringOffset + stringLength] !== 0) {
                stringLength++;
            }

            const strBuf = b.slice(stringOffset, stringOffset + stringLength);
            const s = decodeString(strBuf);

            this.entries.push(s);
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
