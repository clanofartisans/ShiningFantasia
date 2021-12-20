import { lsb32 } from '../bytes';
import { decodeString } from '../string';
import { Resource } from './resource';

export interface Entry {
    id: number,
    name: string,
}

export class EntityList extends Resource {
    // header magic is 0x6E 0x6F 0x6E 0x65 0x00 0x00 0x00 0x00... (none)
    static readonly magic = new Uint8Array([
        0x6e, 0x6f, 0x6e, 0x65, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
    ]);

    entries: Entry[];
    stride: number;

    constructor(b: Buffer) {
        super();

        this.entries = [];
        this.stride = 0;

        let stride = 0;

        // the file format changed slightly at some point, so try to support both.

        if (b.length >= 0x20 && b.compare(EntityList.magic, 0, 0x20, 0, 0x20) === 0) {
            stride = 0x20;
        } else if (b.length >= 0x1c && b.compare(EntityList.magic, 0, 0x1c, 0, 0x1c) === 0) {
            stride = 0x1c;
        }

        if (!stride) {
            throw new Error('not an EntityList');
        }

        if ((b.length % stride) !== 0) {
            throw new Error('bad EntityList length');
        }

        const numEntries = b.length / stride;

        for (let i = 0; i < numEntries; i++) {
            const stringOffset = i * stride;

            let stringLength = stride - 4;

            // Calculate string length.
            while (stringLength > 0 && b[stringOffset + stringLength - 1] === 0) {
                stringLength--;
            }

            const entityId = lsb32(b, stringOffset + stride - 4);

            const strBuf = b.slice(stringOffset, stringOffset + stringLength);
            const s = decodeString(strBuf);

            this.entries.push({
                id: entityId,
                name: s,
            });
        }
    }

    get length(): number {
        return this.entries.length;
    }

    getEntry(index: number): Entry | null {
        if (index < this.entries.length) {
            return this.entries[index];
        }

        return null;
    }
}
