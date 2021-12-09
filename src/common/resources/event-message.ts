import { lsb16, lsb24, lsb32 } from '../bytes';
import { decodeXiString } from '../string';
import { Resource } from './resource';

export class EventMessage extends Resource {

    entries: string[];

    constructor(b: Buffer) {
        super();

        this.entries = [];

        const resourceLength = lsb24(b, 0) + 4;
        if (b.length !== resourceLength) {
            throw new Error('invalid EventMessage resource');
        }

        if (b[3] === 0x10) {
            for (let i = 4; i < b.length; i++) {
                b[i] ^= 0x80;
            }
        }

        let offset = 4;
        let prevOffset = 0;

        const startOffset = lsb32(b, offset) + 4;

        while (offset < startOffset) {
            const stringOffset = lsb32(b, offset) + 4;
            const nextOffset = (offset + 4 < startOffset) ? lsb32(b, offset + 4) + 4 : b.length;
            offset += 4;

            if (stringOffset >= b.length) {
                break;
            }
            if (stringOffset <= prevOffset) {
                break;
            }
            if (nextOffset < stringOffset) {
                break;
            }

            prevOffset = stringOffset;

            let stringLength = (nextOffset - stringOffset) - 1;

            // Calculate string length. Temporary until decodeXiString is complete.
            while (stringLength > 0 && b[stringOffset + stringLength - 1] === 0) {
                stringLength--;
            }

            const strBuf = b.slice(stringOffset, stringOffset + stringLength);
            const s = decodeXiString(strBuf);
            this.entries.push(s);
        }
    }
}
