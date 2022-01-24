import { lsb16, lsb24, lsb32, lsb8 } from '../bytes';
import { Bmp2 } from './bmp2';
import { decodeDmsgEntry, Entry as DmsgEntry } from './dmsg';
import { Resource } from './resource';

import { dumpBinToStr } from '../util';

export enum ItemType {
    ItemType0,
    ItemType1,
    ItemType2,
    ItemType3,
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

export class Item {
    id: number;
    type: ItemType;

    debug?: string;

    _unk0?: number;
    text?: DmsgEntry;
    _unk2?: number;
    stack?: number;
    _unk4?: number;
    level?: number;
    slots?: number;
    races?: number;
    jobs?: number;
    _unk11?: number;
    skill?: number;
    _unk15?: number;
    _unk16?: number;
    _unk17?: number;
    dmg?: number;
    delay?: number;
    _unk20?: number;
    _unk21?: number;
    _unk23?: number;
    _unk24?: number;
    _unk25?: number;
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
    _unk39?: number;
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

    initIcon(b: Buffer, offset: number) {
        const bmp2Length = lsb32(b, 0x280);
        if (bmp2Length > 0) {
            const iconBuffer = b.slice(0x284, 0x284 + bmp2Length);

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

        this._unk0 = lsb16(b, 8);
        this._unk2 = lsb16(b, 4);
        this.stack = lsb16(b, 6);
        this._unk4 = lsb16(b, 0xc);
        this.text = decodeDmsgEntry(b.slice(0x18));
        this._unk15 = lsb8(b, 0xbff);
        this._unk16 = lsb16(b, 0xa);
        this._unk23 = lsb16(b, 0xe);
        this._unk32 = lsb16(b, 0x12);
        this._unk40 = lsb8(b, 0x15);
        this._unk41 = lsb16(b, 0x16);

        this.initIcon(b, 0x280);
    }
}

export class ItemType1 extends Item {
    constructor(id: number, type: ItemType, b: Buffer) {
        super(id, type);

        this._unk0 = lsb16(b, 8);
        this._unk2 = lsb16(b, 4);
        this.stack = lsb16(b, 6);
        this._unk4 = lsb16(b, 0xc);
        this.text = decodeDmsgEntry(b.slice(0x1c));
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
}

export class ItemType2 extends Item {
    constructor(id: number, type: ItemType, b: Buffer) {
        super(id, type);

        this._unk0 = lsb16(b, 8);
        this._unk2 = lsb16(b, 4);
        this.stack = lsb16(b, 6);
        this._unk4 = lsb16(b, 0xc);
        this.text = decodeDmsgEntry(b.slice(0x18));
        this.level = lsb16(b, 0x14);
        this.slots = lsb16(b, 0xe);
        this.jobs = lsb32(b, 0x10);
        this._unk15 = lsb8(b, 0xbff);
        this._unk16 = lsb16(b, 0xa);
        this._unk32 = lsb16(b, 0x16);

        this.initIcon(b, 0x280);
    }
}

export class ItemType3 extends Item {
    constructor(id: number, type: ItemType, b: Buffer) {
        super(id, type);

        this._unk0 = lsb16(b, 8);
        this._unk2 = lsb16(b, 4);
        this.stack = lsb16(b, 6);
        this._unk4 = lsb16(b, 0xc);
        this.text = decodeDmsgEntry(b.slice(0x18));
        this._unk15 = lsb8(b, 0xbff);
        this._unk16 = lsb16(b, 0xa);
        this._unk23 = lsb16(b, 0xe);
        this._unk24 = lsb16(b, 0x10);
        this._unk32 = lsb16(b, 0x12);
        this._unk40 = lsb8(b, 0x15);
        this._unk41 = lsb16(b, 0x16);

        this.initIcon(b, 0x280);
    }
}

export class Armor extends Item {
    constructor(id: number, type: ItemType, b: Buffer) {
        super(id, type);

        this._unk0 = lsb16(b, 8);
        this._unk2 = lsb16(b, 4);
        this.stack = lsb16(b, 6);
        this._unk4 = lsb16(b, 0xc);
        this.text = decodeDmsgEntry(b.slice(0x2c));
        this.level = lsb16(b, 0xe);
        this.slots = lsb16(b, 0x10);
        this.races = lsb16(b, 0x12);
        this.jobs = lsb32(b, 0x14);
        this._unk11 = lsb16(b, 0x18);
        this._unk15 = lsb8(b, 0xbff);
        this._unk16 = lsb16(b, 0xa);
        this._unk17 = lsb16(b, 0x1a);
        this._unk26 = lsb8(b, 0x1c);
        this._unk27 = lsb8(b, 0x1d);
        this._unk28 = lsb16(b, 0x1e);
        this._unk29 = lsb32(b, 0x20);
        this._unk32 = lsb16(b, 0x24);
        this._unk38 = lsb8(b, 0x27);
        this._unk39 = lsb8(b, 0x26);
        this._unk52 = lsb8(b, 0x28);
        this._unk58 = lsb8(b, 0x29);
        this._unk59 = lsb8(b, 0x2a);
        this._unk60 = lsb8(b, 0x2b);

        this.initIcon(b, 0x280);
    }
}

export class Weapon extends Item {
    constructor(id: number, type: ItemType, b: Buffer) {
        super(id, type);

        this._unk0 = lsb16(b, 8);
        this._unk2 = lsb16(b, 4);
        this.stack = lsb16(b, 6);
        this._unk4 = lsb16(b, 0xc);
        this.text = decodeDmsgEntry(b.slice(0x38));
        this.level = lsb16(b, 0xe);
        this.slots = lsb16(b, 0x10);
        this.races = lsb16(b, 0x12);
        this.jobs = lsb32(b, 0x14);
        this._unk11 = lsb16(b, 0x18);
        this.skill = lsb16(b, 0x22);
        this._unk15 = lsb8(b, 0xbff);
        this._unk16 = lsb16(b, 0xa);
        this.dmg = lsb16(b, 0x1c);
        this.delay = lsb16(b, 0x1e);
        this._unk20 = lsb16(b, 0x20);
        this._unk25 = lsb32(b, 0x24);
        this._unk26 = lsb8(b, 0x28);
        this._unk27 = lsb8(b, 0x29);
        this._unk28 = lsb16(b, 0x2a);
        this._unk29 = lsb32(b, 0x2c);
        this._unk32 = lsb16(b, 0x30);
        this._unk38 = lsb8(b, 0x33);
        this._unk39 = lsb8(b, 0x32);
        this._unk52 = lsb8(b, 0x34);
        this._unk58 = lsb8(b, 0x35);
        this._unk59 = lsb8(b, 0x36);
        this._unk60 = lsb8(b, 0x37);

        this.initIcon(b, 0x280);
    }
}

export class ItemType6 extends Item {
    constructor(id: number, type: ItemType, b: Buffer) {
        super(id, type);

        this._unk0 = lsb16(b, 8);
        this._unk2 = lsb16(b, 4);
        this.stack = lsb16(b, 6);
        this._unk4 = lsb16(b, 0xc);
        this.text = decodeDmsgEntry(b.slice(0x54));
        this._unk15 = lsb8(b, 0xbff);
        this._unk16 = lsb16(b, 0xa);
        this._unk21 = lsb16(b, 0xe);
        this._unk31 = lsb32(b, 0x14); // ???
        this._unk32 = lsb16(b, 0x10);

        this.initIcon(b, 0x280);
    }
}

export class ItemType7 extends Item {
    constructor(id: number, type: ItemType, b: Buffer) {
        super(id, type);

        this._unk0 =  lsb16(b, 8);
        this._unk2 = lsb16(b, 4);
        this.stack = lsb16(b, 6);
        this._unk4 = lsb16(b, 0xc);
        this.text = decodeDmsgEntry(b.slice(0x28));
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
}

export class ItemType8 extends Item {
    constructor(id: number, type: ItemType, b: Buffer) {
        super(id, type);

        this.text = decodeDmsgEntry(b.slice(0x20));
        this._unk15 = lsb8(b, 0xbff);
        this._unk42 = lsb32(b, 4);
        this._unk43 = lsb32(b, 8);
        this._unk44 = lsb32(b, 0xc);
        this._unk45 = lsb32(b, 0x10);
        this._unk46 = lsb32(b, 0x14);
        this._unk47 = lsb32(b, 0x18);
        this._unk48 = lsb32(b, 0x1c);
    }
}

export class ItemType9 extends Item {
    constructor(id: number, type: ItemType, b: Buffer) {
        super(id, type);

        this._unk15 = lsb8(b, 0xbff);
        this._unk31 = lsb32(b, 8); // ???
        this._unk50 = lsb32(b, 4);
    }
}

export class ItemType10 extends Item {
    constructor(id: number, type: ItemType, b: Buffer) {
        super(id, type);

        this._unk0 = lsb16(b, 0x26);
        this._unk2 = lsb16(b, 4);
        this.text = decodeDmsgEntry(b.slice(0x70));
        this._unk15 = lsb8(b, 0xbff);
        this._unk16 = lsb16(b, 0xa);
        this._unk33 = lsb32(b, 6); // ???
        this._unk34 = lsb16(b, 0x28);
        this._unk35 = lsb16(b, 0x2c);
        this._unk36 = lsb16(b, 0x2e);
        this._unk37 = lsb32(b, 0x30); // ???

        this.initIcon(b, 0x280);
    }
}

export class ItemType11 extends Item {
    constructor(id: number, type: ItemType, b: Buffer) {
        super(id, type);

        this.text = decodeDmsgEntry(b.slice(0x238));
        this._unk15 = lsb8(b, 0xbff);
        this._unk31 = lsb32(b, 8); // ???
        this._unk49 = lsb32(b, 4);
    }
}

export class ItemType12 extends Item {
    constructor(id: number, type: ItemType, b: Buffer) {
        super(id, type);

        this._unk15 = lsb8(b, 0xbff);
        this._unk51 = lsb32(b, 4); // ???
    }
}

export class ItemType13 extends Item {
    constructor(id: number, type: ItemType, b: Buffer) {
        super(id, type);

        this.text = decodeDmsgEntry(b.slice(0x108));
        this._unk15 = lsb8(b, 0xbff);
        this._unk55 = lsb16(b, 4);
        this._unk56 = lsb16(b, 6);
        this._unk57 = lsb32(b, 8); // ???
    }
}

export class ItemType14 extends Item {
    constructor(id: number, type: ItemType, b: Buffer) {
        super(id, type);

        this.text = decodeDmsgEntry(b.slice(8));
        this._unk15 = lsb8(b, 0xbff);
        this._unk53 = lsb8(b, 4);
        this._unk54 = lsb24(b, 5); // ???
    }
}

export class Gil extends Item {
    constructor(id: number, type: ItemType, b: Buffer) {
        super(id, type);

        this._unk0 = lsb16(b, 8);
        this._unk2 = lsb16(b, 4);
        this.stack = lsb16(b, 6);
        this._unk4 = lsb16(b, 0xc);
        this.text = decodeDmsgEntry(b.slice(0x10));
        this._unk15 = lsb8(b, 0xbff);
        this._unk16 = lsb16(b, 0xa);
        this._unk32 = lsb16(b, 0xe);

        this.initIcon(b, 0x280);
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
        return ItemType.ItemType3;
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
    [ItemType.ItemType3]: ItemType3,
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

            const item = decodeItem(itemBuf);
            this.entries.push(item);
        }
    }
}
