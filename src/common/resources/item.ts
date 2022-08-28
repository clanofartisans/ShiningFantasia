import { lsb16, lsb24, lsb32, lsb8 } from '../bytes';
import { Bmp2 } from './bmp2';
import { decodeDmsgEntry, encodeDmsgEntry, Entry as DmsgEntry } from './dmsg';
import { Resource } from './resource';

import { dumpBinToStr } from '../util';

export enum ItemType {
    ItemType0,
    ItemType1,
    ItemType2,
    Armor,
    Weapon,
    ItemType6,
    ItemType7,
    ItemType8,
    ItemType9,
    ItemType10,
    ItemType11,
    ItemType12,
    ItemType13,
    ItemType14,
    Gil,
    Unknown,
}

enum ItemFieldType {
    U8,
    U16,
    U24,
    U32,
    Icon,
    Text,
}

type ItemFields = Record<string, number>;

const ItemFieldTypes: Record<string, ItemFieldType> = {
    kind: ItemFieldType.U16,
    text: ItemFieldType.Text,
    flags: ItemFieldType.U16,
    stack: ItemFieldType.U16,
    targets: ItemFieldType.U16,
    level: ItemFieldType.U16,
    slots: ItemFieldType.U16,
    races: ItemFieldType.U16,
    jobs: ItemFieldType.U32,
    slvl: ItemFieldType.U16,
    skill: ItemFieldType.U16,
    _unk15: ItemFieldType.U8,
    _unk16: ItemFieldType.U16,
    shieldSize: ItemFieldType.U16,
    dmg: ItemFieldType.U16,
    delay: ItemFieldType.U16,
    dps: ItemFieldType.U16,
    _unk21: ItemFieldType.U16,
    _unk23: ItemFieldType.U16,
    _unk24: ItemFieldType.U16,
    emote: ItemFieldType.U32,
    _unk26: ItemFieldType.U8,
    _unk27: ItemFieldType.U8,
    _unk28: ItemFieldType.U32,
    _unk29: ItemFieldType.U32,
    _unk30: ItemFieldType.U16,
    _unk31: ItemFieldType.U32, // ???
    _unk32: ItemFieldType.U16,
    _unk33: ItemFieldType.U32, // ???
    _unk34: ItemFieldType.U16,
    _unk35: ItemFieldType.U16,
    _unk36: ItemFieldType.U16,
    _unk37: ItemFieldType.U32, // ???
    _unk38: ItemFieldType.U8,
    ilvl: ItemFieldType.U8,
    _unk40: ItemFieldType.U8,
    _unk41: ItemFieldType.U16,
    _unk42: ItemFieldType.U32,
    _unk43: ItemFieldType.U32,
    _unk44: ItemFieldType.U32,
    _unk45: ItemFieldType.U32,
    _unk46: ItemFieldType.U32,
    _unk47: ItemFieldType.U32,
    _unk48: ItemFieldType.U32,
    _unk49: ItemFieldType.U32,
    _unk50: ItemFieldType.U32,
    _unk51: ItemFieldType.U32, // ???
    _unk52: ItemFieldType.U8,
    _unk53: ItemFieldType.U8,
    _unk54: ItemFieldType.U24, // ???
    _unk55: ItemFieldType.U16,
    _unk56: ItemFieldType.U16,
    _unk57: ItemFieldType.U32,
    _unk58: ItemFieldType.U8,
    _unk59: ItemFieldType.U8,
    _unk60: ItemFieldType.U8,
};

export class Item {
    id: number;
    type: ItemType;

    debug?: string;

    kind?: number;
    text?: DmsgEntry;
    flags?: number;
    stack?: number;
    targets?: number;
    level?: number;
    slots?: number;
    races?: number;
    jobs?: number;
    slvl?: number;
    skill?: number;
    _unk15?: number;
    _unk16?: number;
    shieldSize?: number;
    dmg?: number;
    delay?: number;
    dps?: number;
    _unk21?: number;
    _unk23?: number;
    _unk24?: number;
    emote?: number;
    _unk26?: number;
    _unk27?: number;
    _unk28?: number;
    _unk29?: number;
    _unk30?: number;
    _unk31?: number;
    _unk32?: number;
    _unk33?: number;
    _unk34?: number;
    _unk35?: number;
    _unk36?: number;
    _unk37?: number;
    _unk38?: number;
    ilvl?: number;
    _unk40?: number;
    _unk41?: number;
    _unk42?: number;
    _unk43?: number;
    _unk44?: number;
    _unk45?: number;
    _unk46?: number;
    _unk47?: number;
    _unk48?: number;
    _unk49?: number;
    _unk50?: number;
    _unk51?: number;
    _unk52?: number;
    _unk53?: number;
    _unk54?: number;
    _unk55?: number;
    _unk56?: number;
    _unk57?: number;
    _unk58?: number;
    _unk59?: number;
    _unk60?: number;

    iconTexture?: Bmp2 | null;
    iconTextureBase64?: string;

    constructor(id: number, type: ItemType, b?: Buffer) {
        this.id = id;
        this.type = type;

        if (b) {
            this.debug = dumpBinToStr(b);
        }
    }

    static encode(b: Buffer, item: Item, fields?: ItemFields) {
        b.writeUInt32LE(item.id, 0);

        if (item.iconTextureBase64) {
            const iconBuffer = Buffer.from(item.iconTextureBase64, 'base64');

            b.writeUInt32LE(iconBuffer.length, 0x280);
            b.set(iconBuffer, 0x284);
        }

        if (fields) {
            // todo - convert decode to table method
            const _item = item as any;

            for (const [field, offset] of Object.entries(fields)) {
                const type = ItemFieldTypes[field];
                const value =  _item[field];

                switch (type) {
                    case ItemFieldType.U8:
                        b.writeUInt8(value, offset);
                        break;
                    case ItemFieldType.U16:
                        b.writeUInt16LE(value, offset);
                        break;
                    case ItemFieldType.U24:
                        // todo - ???
                        b.writeUInt16LE(value, offset);
                        break;
                    case ItemFieldType.U32:
                        b.writeUInt32LE(value, offset);
                        break;
                    case ItemFieldType.Icon:
                        // already handled above
                        break;
                    case ItemFieldType.Text:
                        encodeDmsgEntry(b.subarray(offset), value);
                        break;
                }
            }
        }
    }

    initIcon(b: Buffer, offset: number) {
        const bmp2Length = lsb32(b, 0x280);
        if (bmp2Length > 0) {
            const iconBuffer = b.subarray(0x284, 0x284 + bmp2Length);

            this.iconTexture = new Bmp2(iconBuffer);
            this.iconTextureBase64 = iconBuffer.toString('base64');
        } else {
            this.iconTexture = null;
        }
    }

    get itemName() {
        if (!this.text) {
            return '<Unknown>';
        }

        if (this.text.length > 0 && typeof this.text[0] === 'string') {
            return this.text[0];
        }

        return '';
    }
}

export class ItemType0 extends Item {
    constructor(id: number, type: ItemType, b: Buffer) {
        super(id, type);

        this.kind = lsb16(b, 8);
        this.flags = lsb16(b, 4);
        this.stack = lsb16(b, 6);
        this.targets = lsb16(b, 0xc);
        this.text = decodeDmsgEntry(b.subarray(0x18));
        this._unk15 = lsb8(b, 0xbff);
        this._unk16 = lsb16(b, 0xa);
        this._unk23 = lsb16(b, 0xe);
        this._unk24 = lsb16(b, 0x10);
        this._unk32 = lsb16(b, 0x12);
        this._unk40 = lsb8(b, 0x15);
        this._unk41 = lsb16(b, 0x16);

        this.initIcon(b, 0x280);
    }

    static encode(b: Buffer, item: Item) {
        Item.encode(b, item, {
            kind: 8,
            flags: 4,
            stack: 6,
            targets: 0xc,
            text: 0x18,
            _unk15: 0xbff,
            _unk16: 0xa,
            _unk23: 0xe,
            _unk24: 0x10,
            _unk32: 0x12,
            _unk40: 0x15,
            _unk41: 0x16,
        });
/*
        b.writeUInt16LE(item.kind!, 8);
        b.writeUInt16LE(item.flags!, 4);
        b.writeUInt16LE(item.stack!, 6);
        b.writeUInt16LE(item.targets!, 0xc);
        encodeDmsgEntry(b.subarray(0x18), item.text!);
        b.writeUInt8(item._unk15!, 0xbff);
        b.writeUInt16LE(item._unk16!, 0xa);
        b.writeUInt16LE(item._unk23!, 0xe);
        b.writeUInt16LE(item._unk32!, 0x12);
        b.writeUInt8(item._unk40!, 0x15);
        b.writeUInt16LE(item._unk41!, 0x16);
*/
    }
}

export class ItemType1 extends Item {
    constructor(id: number, type: ItemType, b: Buffer) {
        super(id, type);

        this.kind = lsb16(b, 8);
        this.flags = lsb16(b, 4);
        this.stack = lsb16(b, 6);
        this.targets = lsb16(b, 0xc);
        this.text = decodeDmsgEntry(b.subarray(0x1c));
        this._unk15 = lsb8(b, 0xbff);
        this._unk16 = lsb16(b, 0xa);
        this._unk21 = lsb16(b, 0xe);
        this._unk32 = lsb16(b, 0x10);
        this._unk40 = lsb8(b, 0x13);
        this._unk41 = lsb16(b, 0x14);
        this._unk58 = lsb8(b, 0x16);
        this._unk59 = lsb8(b, 0x17);
        this._unk60 = lsb8(b, 0x18);

        this.initIcon(b, 0x280);
    }

    static encode(b: Buffer, item: Item) {
        Item.encode(b, item, {
            kind: 8,
            flags: 4,
            stack: 6,
            targets: 0xc,
            text: 0x1c,
            _unk15: 0xbff,
            _unk16: 0xa,
            _unk21: 0xe,
            _unk32: 0x10,
            _unk40: 0x13,
            _unk41: 0x14,
            _unk58: 0x16,
            _unk59: 0x17,
            _unk60: 0x18,
        });

    }
}

export class ItemType2 extends Item {
    constructor(id: number, type: ItemType, b: Buffer) {
        super(id, type);

        this.kind = lsb16(b, 8);
        this.flags = lsb16(b, 4);
        this.stack = lsb16(b, 6);
        this.targets = lsb16(b, 0xc);
        this.text = decodeDmsgEntry(b.subarray(0x18));
        this.level = lsb16(b, 0x14);
        this.slots = lsb16(b, 0xe);
        this.jobs = lsb32(b, 0x10); // todo - pup-specific
        this._unk15 = lsb8(b, 0xbff);
        this._unk16 = lsb16(b, 0xa);
        this._unk32 = lsb16(b, 0x16);

        this.initIcon(b, 0x280);
    }

    static encode(b: Buffer, item: Item) {
        Item.encode(b, item, {
            kind: 8,
            flags: 4,
            stack: 6,
            targets: 0xc,
            text: 0x18,
            level: 0x14,
            slots: 0xe,
            jobs: 0x10,
            _unk15: 0xbff,
            _unk16: 0xa,
            _unk32: 0x16,
        });
    }
}

export class Armor extends Item {
    constructor(id: number, type: ItemType, b: Buffer) {
        super(id, type);

        this.kind = lsb16(b, 8);
        this.flags = lsb16(b, 4);
        this.stack = lsb16(b, 6);
        this.targets = lsb16(b, 0xc);
        this.text = decodeDmsgEntry(b.subarray(0x2c));
        this.level = lsb16(b, 0xe);
        this.slots = lsb16(b, 0x10);
        this.races = lsb16(b, 0x12);
        this.jobs = lsb32(b, 0x14);
        this.slvl = lsb16(b, 0x18);
        this._unk15 = lsb8(b, 0xbff);
        this._unk16 = lsb16(b, 0xa);
        this.shieldSize = lsb16(b, 0x1a);
        this._unk26 = lsb8(b, 0x1c);
        this._unk27 = lsb8(b, 0x1d);
        this._unk28 = lsb16(b, 0x1e);
        this._unk29 = lsb32(b, 0x20);
        this._unk32 = lsb16(b, 0x24);
        this._unk38 = lsb8(b, 0x27);
        this.ilvl = lsb8(b, 0x26);
        this._unk52 = lsb8(b, 0x28);
        this._unk58 = lsb8(b, 0x29);
        this._unk59 = lsb8(b, 0x2a);
        this._unk60 = lsb8(b, 0x2b);

        this.initIcon(b, 0x280);
    }

    static encode(b: Buffer, item: Item) {
        Item.encode(b, item, {
            kind: 8,
            flags: 4,
            stack: 6,
            targets: 0xc,
            text: 0x2c,
            level: 0xe,
            slots: 0x10,
            races: 0x12,
            jobs: 0x14,
            slvl: 0x18,
            _unk15: 0xbff,
            _unk16: 0xa,
            shieldSize: 0x1a,
            _unk26: 0x1c,
            _unk27: 0x1d,
            _unk28: 0x1e,
            _unk29: 0x20,
            _unk32: 0x24,
            _unk38: 0x27,
            ilvl: 0x26,
            _unk52: 0x28,
            _unk58: 0x29,
            _unk59: 0x2a,
            _unk60: 0x2b,
        });
    }
}

export class Weapon extends Item {
    constructor(id: number, type: ItemType, b: Buffer) {
        super(id, type);

        this.kind = lsb16(b, 8);
        this.flags = lsb16(b, 4);
        this.stack = lsb16(b, 6);
        this.targets = lsb16(b, 0xc);
        this.text = decodeDmsgEntry(b.subarray(0x38));
        this.level = lsb16(b, 0xe);
        this.slots = lsb16(b, 0x10);
        this.races = lsb16(b, 0x12);
        this.jobs = lsb32(b, 0x14);
        this.slvl = lsb16(b, 0x18);
        this.skill = lsb16(b, 0x22);
        this._unk15 = lsb8(b, 0xbff);
        this._unk16 = lsb16(b, 0xa);
        this.dmg = lsb16(b, 0x1c);
        this.delay = lsb16(b, 0x1e);
        this.dps = lsb16(b, 0x20);
        this.emote = lsb32(b, 0x24);
        this._unk26 = lsb8(b, 0x28);
        this._unk27 = lsb8(b, 0x29);
        this._unk28 = lsb16(b, 0x2a);
        this._unk29 = lsb32(b, 0x2c);
        this._unk32 = lsb16(b, 0x30);
        this._unk38 = lsb8(b, 0x33);
        this.ilvl = lsb8(b, 0x32);
        this._unk52 = lsb8(b, 0x34);
        this._unk58 = lsb8(b, 0x35);
        this._unk59 = lsb8(b, 0x36);
        this._unk60 = lsb8(b, 0x37);

        this.initIcon(b, 0x280);
    }

    static encode(b: Buffer, item: Item) {
        Item.encode(b, item, {
            kind: 8,
            flags: 4,
            stack: 6,
            targets: 0xc,
            text: 0x38,
            level: 0xe,
            slots: 0x10,
            races: 0x12,
            jobs: 0x14,
            slvl: 0x18,
            skill: 0x22,
            _unk15: 0xbff,
            _unk16: 0xa,
            dmg: 0x1c,
            delay: 0x1e,
            dps: 0x20,
            emote: 0x24,
            _unk26: 0x28,
            _unk27: 0x29,
            _unk28: 0x2a,
            _unk29: 0x2c,
            _unk32: 0x30,
            _unk38: 0x33,
            ilvl: 0x32,
            _unk52: 0x34,
            _unk58: 0x35,
            _unk59: 0x36,
            _unk60: 0x37,
    });
/*
        b.writeUInt16LE(item.kind!, 8);
        b.writeUInt16LE(item.flags!, 4);
        b.writeUInt16LE(item.stack!, 6);
        b.writeUInt16LE(item.targets!, 0xc);
        encodeDmsgEntry(b.subarray(0x38), item.text!);
        b.writeUInt16LE(item.level!, 0xe);
        b.writeUInt16LE(item.slots!, 0x10);
        b.writeUInt16LE(item.races!, 0x12);
        b.writeInt32LE(item.jobs!, 0x14);
        b.writeUInt16LE(item.slvl!, 0x18);
        b.writeUInt16LE(item.skill!, 0x22);
        b.writeUInt8(item._unk15!, 0xbff);
        b.writeUInt16LE(item._unk16!, 0xa);
        b.writeUInt16LE(item.dmg!, 0x1c);
        b.writeUInt16LE(item.delay!, 0x1e);
        b.writeUInt16LE(item.dps!, 0x20);
        b.writeUInt16LE(item.emote!, 0x24);
        b.writeUInt8(item._unk26!, 0x28);
        b.writeUInt8(item._unk27!, 0x29);
        b.writeUInt16LE(item._unk28!, 0x2a);
        b.writeInt32LE(item._unk29!, 0x2c);
        b.writeUInt16LE(item._unk32!, 0x30);
        b.writeUInt8(item._unk38!, 0x33);
        b.writeUInt8(item.ilvl!, 0x32);
        b.writeUInt8(item._unk52!, 0x34);
        b.writeUInt8(item._unk58!, 0x35);
        b.writeUInt8(item._unk59!, 0x36);
        b.writeUInt8(item._unk60!, 0x37);
*/
    }
}

export class ItemType6 extends Item {
    constructor(id: number, type: ItemType, b: Buffer) {
        super(id, type);

        this.kind = lsb16(b, 8);
        this.flags = lsb16(b, 4);
        this.stack = lsb16(b, 6);
        this.targets = lsb16(b, 0xc);
        this.text = decodeDmsgEntry(b.subarray(0x54));
        this._unk15 = lsb8(b, 0xbff);
        this._unk16 = lsb16(b, 0xa);
        this._unk21 = lsb16(b, 0xe);
        this._unk31 = lsb32(b, 0x14); // ???
        this._unk32 = lsb16(b, 0x10);

        this.initIcon(b, 0x280);
    }

    static encode(b: Buffer, item: Item) {
        Item.encode(b, item, {
            kind: 8,
            flags: 4,
            stack: 6,
            targets: 0xc,
            text: 0x54,
            _unk15: 0xbff,
            _unk16: 0xa,
            _unk21: 0xe,
            _unk31: 0x14, // ???
            _unk32: 0x10,
        });
    }
}

export class ItemType7 extends Item {
    constructor(id: number, type: ItemType, b: Buffer) {
        super(id, type);

        this.kind =  lsb16(b, 8);
        this.flags = lsb16(b, 4);
        this.stack = lsb16(b, 6);
        this.targets = lsb16(b, 0xc);
        this.text = decodeDmsgEntry(b.subarray(0x28));
        this.level = lsb16(b, 0xe);
        this.slots = lsb16(b, 0x10);
        this.races = lsb16(b, 0x12);
        this.jobs = lsb32(b, 0x14);
        this._unk15 = lsb8(b, 0xbff);
        this._unk16 = lsb16(b, 0xa);
        this._unk26 = lsb8(b, 0x1a);
        this._unk27 = lsb8(b, 0x1b);
        this._unk28 = lsb32(b, 0x1c);
        this._unk29 = lsb32(b, 0x20);
        this._unk30 = lsb16(b, 0x18);
        this._unk32 = lsb16(b, 0x24);

        this.initIcon(b, 0x280);
    }

    static encode(b: Buffer, item: Item) {
        Item.encode(b, item, {
            kind: 8,
            flags: 4,
            stack: 6,
            targets: 0xc,
            text: 0x28,
            level: 0xe,
            slots: 0x10,
            races: 0x12,
            jobs: 0x14,
            _unk15: 0xbff,
            _unk16: 0xa,
            _unk26: 0x1a,
            _unk27: 0x1b,
            _unk28: 0x1c,
            _unk29: 0x20,
            _unk30: 0x18,
            _unk32: 0x24,
        });
    }
}

export class ItemType8 extends Item {
    constructor(id: number, type: ItemType, b: Buffer) {
        super(id, type);

        this.text = decodeDmsgEntry(b.subarray(0x20));
        this._unk15 = lsb8(b, 0xbff);
        this._unk42 = lsb32(b, 4);
        this._unk43 = lsb32(b, 8);
        this._unk44 = lsb32(b, 0xc);
        this._unk45 = lsb32(b, 0x10);
        this._unk46 = lsb32(b, 0x14);
        this._unk47 = lsb32(b, 0x18);
        this._unk48 = lsb32(b, 0x1c);
    }

    static encode(b: Buffer, item: Item) {
        Item.encode(b, item, {
            text: 0x20,
            _unk15: 0xbff,
            _unk42: 4,
            _unk43: 8,
            _unk44: 0xc,
            _unk45: 0x10,
            _unk46: 0x14,
            _unk47: 0x18,
            _unk48: 0x1c,
        });
    }
}

export class ItemType9 extends Item {
    constructor(id: number, type: ItemType, b: Buffer) {
        super(id, type);

        this._unk15 = lsb8(b, 0xbff);
        this._unk31 = lsb32(b, 8); // ???
        this._unk50 = lsb32(b, 4);
    }

    static encode(b: Buffer, item: Item) {
        Item.encode(b, item, {
            _unk15: 0xbff,
            _unk31: 8, // ???
            _unk50: 4,
        });
    }
}

export class ItemType10 extends Item {
    constructor(id: number, type: ItemType, b: Buffer) {
        super(id, type);

        this.kind = lsb16(b, 0x26);
        this.flags = lsb16(b, 4);
        this.text = decodeDmsgEntry(b.subarray(0x70));
        this._unk15 = lsb8(b, 0xbff);
        this._unk16 = lsb16(b, 0xa);
        this._unk33 = lsb32(b, 6); // ???
        this._unk34 = lsb16(b, 0x28);
        this._unk35 = lsb16(b, 0x2c);
        this._unk36 = lsb16(b, 0x2e);
        this._unk37 = lsb32(b, 0x30); // ???

        this.initIcon(b, 0x280);
    }

    static encode(b: Buffer, item: Item) {
        Item.encode(b, item, {
            kind: 0x26,
            flags: 4,
            text: 0x70,
            _unk15: 0xbff,
            _unk16: 0xa,
            _unk33: 6, // ???
            _unk34: 0x28,
            _unk35: 0x2c,
            _unk36: 0x2e,
            _unk37: 0x30, // ???
        });
    }
}

export class ItemType11 extends Item {
    constructor(id: number, type: ItemType, b: Buffer) {
        super(id, type);

        this.text = decodeDmsgEntry(b.subarray(0x238));
        this._unk15 = lsb8(b, 0xbff);
        this._unk31 = lsb32(b, 8); // ???
        this._unk49 = lsb32(b, 4);
    }

    static encode(b: Buffer, item: Item) {
        Item.encode(b, item, {
            text: 0x238,
            _unk15: 0xbff,
            _unk31: 8, // ???
            _unk49: 4,
        });
    }
}

export class ItemType12 extends Item {
    constructor(id: number, type: ItemType, b: Buffer) {
        super(id, type);

        this._unk15 = lsb8(b, 0xbff);
        this._unk51 = lsb32(b, 4); // ???
    }

    static encode(b: Buffer, item: Item) {
        Item.encode(b, item, {
            _unk15: 0xbff,
            _unk51: 4, // ???
        });
    }
}

export class ItemType13 extends Item {
    constructor(id: number, type: ItemType, b: Buffer) {
        super(id, type);

        this.text = decodeDmsgEntry(b.subarray(0x108));
        this._unk15 = lsb8(b, 0xbff);
        this._unk55 = lsb16(b, 4);
        this._unk56 = lsb16(b, 6);
        this._unk57 = lsb32(b, 8); // ???
    }

    static encode(b: Buffer, item: Item) {
        Item.encode(b, item, {
            text: 0x108,
            _unk15: 0xbff,
            _unk55: 4,
            _unk56: 6,
            _unk57: 8, // ???
        });
    }
}

export class ItemType14 extends Item {
    constructor(id: number, type: ItemType, b: Buffer) {
        super(id, type);

        this.text = decodeDmsgEntry(b.subarray(8));
        this._unk15 = lsb8(b, 0xbff);
        this._unk53 = lsb8(b, 4);
        this._unk54 = lsb24(b, 5); // ???
    }

    static encode(b: Buffer, item: Item) {
        Item.encode(b, item, {
            text: 8,
            _unk15: 0xbff,
            _unk53: 4,
            _unk54: 5, // ???
        });
    }
}

export class Gil extends Item {
    constructor(id: number, type: ItemType, b: Buffer) {
        super(id, type);

        this.kind = lsb16(b, 8);
        this.flags = lsb16(b, 4);
        this.stack = lsb16(b, 6);
        this.targets = lsb16(b, 0xc);
        this.text = decodeDmsgEntry(b.subarray(0x10));
        this._unk15 = lsb8(b, 0xbff);
        this._unk16 = lsb16(b, 0xa);
        this._unk32 = lsb16(b, 0xe);

        this.initIcon(b, 0x280);
    }

    static encode(b: Buffer, item: Item) {
        Item.encode(b, item, {
            kind: 8,
            flags: 4,
            stack: 6,
            targets: 0xc,
            text: 0x10,
            _unk15: 0xbff,
            _unk16: 0xa,
            _unk32: 0xe,
        });

/*
        b.writeUInt16LE(item.kind!, 8);
        b.writeUInt16LE(item.flags!, 4);
        b.writeUInt16LE(item.stack!, 6);
        b.writeUInt16LE(item.targets!, 0xc);
        encodeDmsgEntry(b.subarray(0x10), item.text!);
        b.writeUInt8(item._unk15!, 0xbff);
        b.writeUInt16LE(item._unk16!, 0xa);
        b.writeUInt16LE(item._unk32!, 0xe);
*/
    }
}

export class Unknown extends Item {

}

function getItemType(itemId: number): ItemType {
    if (itemId >= 0 && itemId < 4096) {
        return ItemType.ItemType0;
    }
    if (itemId >= 4096 && itemId < 8192) {
        return ItemType.ItemType1;
    }
    if (itemId >= 8192 && itemId < 8704) {
        return ItemType.ItemType2;
    }
    if (itemId >= 8704 && itemId < 10240) {
        return ItemType.ItemType0;
    }
    if (itemId >= 10240 && itemId < 16384) {
        return ItemType.Armor;
    }
    if (itemId >= 16384 && itemId < 23040) {
        return ItemType.Weapon;
    }
    if (itemId >= 23040 && itemId < 28672) {
        return ItemType.Armor;
    }
    if (itemId >= 28672 && itemId < 29696) {
        return ItemType.ItemType6;
    }
    if (itemId >= 29696 && itemId < 30720) {
        return ItemType.ItemType7;
    }
    if (itemId >= 57344 && itemId < 61432) {
        return ItemType.ItemType8;
    }
    if (itemId >= 61432 && itemId < 61440) {
        return ItemType.ItemType9;
    }
    if (itemId >= 61440 && itemId < 61952) {
        return ItemType.ItemType10;
    }
    if (itemId >= 61952 && itemId < 62976) {
        return ItemType.ItemType11;
    }
    if (itemId >= 62976 && itemId < 62996) {
        return ItemType.ItemType12;
    }
    if (itemId >= 63008 && itemId < 63024) {
        return ItemType.ItemType13;
    }
    if (itemId >= 63024 && itemId < 63264) {
        return ItemType.ItemType14;
    }
    if (itemId === 65535) {
        return ItemType.Gil;
    }

    return ItemType.Unknown;
}

const itemConstructors = {
    [ItemType.ItemType0]: ItemType0,
    [ItemType.ItemType1]: ItemType1,
    [ItemType.ItemType2]: ItemType2,
    [ItemType.Armor]: Armor,
    [ItemType.Weapon]: Weapon,
    [ItemType.ItemType6]: ItemType6,
    [ItemType.ItemType7]: ItemType7,
    [ItemType.ItemType8]: ItemType8,
    [ItemType.ItemType9]: ItemType9,
    [ItemType.ItemType10]: ItemType10,
    [ItemType.ItemType11]: ItemType11,
    [ItemType.ItemType12]: ItemType12,
    [ItemType.ItemType13]: ItemType13,
    [ItemType.ItemType14]: ItemType14,
    [ItemType.Gil]: Gil,
    [ItemType.Unknown]: Item,
};

function decodeItem(b: Buffer): Item {
    const itemId = lsb32(b, 0);
    const itemType = getItemType(itemId);

    return new itemConstructors[itemType](itemId, itemType, b);
}

function encodeItem(b: Buffer, item: Item) {
    return itemConstructors[item.type].encode(b, item);
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
            const itemBuf = b.subarray(i, i + 0xc00);

            const item = decodeItem(itemBuf);
            this.entries.push(item);
        }
    }
}

export function exportDat(items: Item[]): Buffer {
    const b = Buffer.alloc(0xc00 * items.length);

    for (let i = 0, j = 0; i < b.length; i += 0xc00, j += 1) {
        const itemBuf = b.subarray(i, i + 0xc00);

        encodeItem(itemBuf, items[j]);
    }

    for (let i = 0; i < b.length; i++) {
        b[i] = (b[i] << 5) | (b[i] >> 3);
    }

    return b;
}
