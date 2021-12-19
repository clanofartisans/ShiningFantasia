import { lsb16, lsb24, lsb32 } from '../bytes';
import { decodeString } from '../string';
import { Resource } from './resource';

import { dumpBinToStr } from '../datloader';

export interface Item {
    id: number,
    debug: string,
}

export class ItemDatabase extends Resource {

    entries: Item[];

    constructor(b: Buffer) {
        super();

        this.entries = [];

        if ((b.length % 0xc00) !== 0) {
            throw new Error('invalid Item resource');
        }

        for (let i = 0; i < b.length; i++) {
            b[i] = (b[i] >> 5) | (b[i] << 3);
        }

        for (let i = 0; i < b.length; i += 0xc00) {
            const itemBuf = b.slice(i, i + 0xc00);

            this.entries.push({
                id: lsb32(itemBuf, 0),
                debug: dumpBinToStr(itemBuf),
            });
        }
    }
}
