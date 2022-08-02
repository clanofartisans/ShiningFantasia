import { readFileSync, writeFileSync } from 'fs';

import { ChunkedResourceType, ChunkedResource } from '../common/resources/chunked-resource';

const magicTypes = [
    "NONE",
    "WHITE",
    "BLACK",
    "SUMMON",
    "NINJUTSU",
    "SONG",
    "BLUE",
    "GEOMANCY",
    "TRUST",
];

const elementNames: Record<number, string> = {
    0: 'FIRE',
    1: 'ICE',
    2: 'WIND',
    3: 'EARTH',
    4: 'THUNDER',
    5: 'WATER',
    6: 'LIGHT',
    7: 'DARK',
    15: 'NONE',
};

function getElementName(ele: number): string {
    const elementName: string | undefined = elementNames[ele];
    if (elementName) {
        return elementName;
    }
    return `${ele}`;
}

// 7F st
// 1D stpc
// A0 stnpc
// 05 stpt
// 0D stal

// 5C trade
// 20 check/attack

// 01 0200 0000 self
// 02 0100 0000 pet
// 04 0004 0000 party (includes alliance in pvp situations)
// 08 0008 0000 alliance
// 10 0001 0000 pc
// 20 0010 0000 mob
// 40 0002 0000 npc
// 80 0002 1800 npc

// 0001 pc
// 0002 npc
// 0004 party
// 0008 alliance
// 0010 mob
// 0020 door
// 0040 lift
// 0080 model
// 0100 pet
// 0200 self
// 0400 pvp
// 0800 fellow
// 1000 trust

const targetBits: Record<number, string> = {
    0: 'SELF',
    1: 'PET',
    2: 'PARTY',
    3: 'ALLIANCE',
    4: 'PC',
    5: 'MOB',
    6: 'NPC',
    7: 'NPC_NOTRUST'
};

function getTargets(bits: number): string[] {
    const flags = [];

    for (let i = 0; i < 16; i++) {
        if (((1 << i) & bits) !== 0) {
            const targetName = targetBits[i] ?? `${i}`;
            flags.push(targetName);
        }
    }

    return flags;
}

const jobNames = [
    'NONE',
    'WAR',
    'MNK',
    'WHM',
    'BLM',
    'RDM',
    'THF',
    'PLD',
    'DRK',
    'BST',
    'BRD',
    'RNG',
    'SAM',
    'NIN',
    'DRG',
    'SMN',
    'BLU',
    'COR',
    'PUP',
    'DNC',
    'SCH',
    'GEO',
    'RUN',
    'MON',
];

const jobBits = {
    NONE: 0x00000001,
    WAR: 0x00000002,
    MNK: 0x00000004,
    WHM: 0x00000008,
    BLM: 0x00000010,
    RDM: 0x00000020,
    THF: 0x00000040,
    PLD: 0x00000080,
    DRK: 0x00000100,
    BST: 0x00000200,
    BRD: 0x00000400,
    RNG: 0x00000800,
    SAM: 0x00001000,
    NIN: 0x00002000,
    DRG: 0x00004000,
    SMN: 0x00008000,
    BLU: 0x00010000,
    COR: 0x00020000,
    PUP: 0x00040000,
    DNC: 0x00080000,
    SCH: 0x00100000,
    GEO: 0x00200000,
    RUN: 0x00400000,
    MON: 0x00800000,
};

function jobBitsToArray(bits: number): string[] {
    const jobs = [];

    for (const [job, bit] of Object.entries(jobBits)) {
        if ((bit & bits) !== 0) {
            jobs.push(job);
        }
    }

    return jobs;
}

// TODO - RENAME TO casting restrictions
function getTargetFlags(bits: number): string[] {
    const flags = [];

    for (let i = 0; i < 8; i++) {
        if (((1 << i) & bits) !== 0) {
            switch (i) {
                case 2:
                    flags.push('ADDENDUM');
                    break;
                case 3:
                    // Kaustra / Embrava
                    flags.push('SCHOLAR');
                    break;
                case 4:
                    flags.push('ELEMENTAL_SEAL');
                    break;
                case 5:
                    flags.push('GEOCOLURE');
                    break;
                default:
                    flags.push(`${i}`);
                    break;
            }
        }
    }

    return flags;
}

if (process.argv.length !== 4) {
    console.error('Incorrect command line arguments!');
    process.exit(1);
}

const menuDat = readFileSync(process.argv[2]);

const menuRes = new ChunkedResource(menuDat);

const mgc: any = [];

for (let i = 0; i < menuRes.resources.length; i++) {
    const res = menuRes.resources[i];

    if (res.type == ChunkedResourceType.Mgb && res.name === 'mgc_') {
        
        const numSpells = Math.floor(res.temp.length / 100);

        for (let s = 0; s < numSpells; s++) {
            const b = res.temp.slice(s * 100, (s + 1) * 100);

            const obj: any = {};

            // word id;
            obj.id = b.readInt16LE(0x00);
            // word magicType;
            obj.magicType = magicTypes[b.readInt16LE(0x02)];
            // word field2_0x4;
            obj.element = getElementName(b.readInt16LE(0x04));
            // word field4_0x6;
            obj.targets = getTargets(b.readInt16LE(0x06));
            // undefined field5_0x8;
            obj._08 = b.readInt8(0x08);
            // undefined field6_0x9;
            obj._09 = b.readInt8(0x09);
            // word mpCost;
            obj.mpCost = b.readInt16LE(0x0A);
            // byte field8_0xc;
            obj.castTime = b.readUInt8(0x0C);
            // byte field9_0xd;
            obj.recastTime = b.readUInt8(0x0D);
            // word levels[24];
            obj.levels = {};
            for (let l = 0; l < 24; l++) {
                const level = b.readInt16LE(0x0E + l * 2);
                if (level > -1) {
                    obj.levels[jobNames[l]] = level;
                }
            }
            // undefined field11_0x3a;
            obj._3A = b.readInt8(0x3A);
            // undefined field12_0x3b;
            obj._3B = b.readInt8(0x3B);
            // undefined field13_0x3c;
            obj._3C = b.readInt8(0x3C);
            // undefined field14_0x3d;
            obj._3D = b.readInt8(0x3D);
            // word field15_0x3e;
            obj._3E = b.readInt16LE(0x3E);
            // word field16_0x40;
            obj.iconId = b.readInt16LE(0x40);
            // word field17_0x42;
            obj.icon2Id = b.readInt16LE(0x42);
            // byte field18_0x44;
            obj.targetFlags = getTargetFlags(b.readUInt8(0x44));
            // byte field19_0x45;
            // 0h,     1h,     3h,     4h
            // 5h,     6h,     7h,     8h
            // Ah,     Ch,     Eh,    10h
            // 14h,    19h,    1Eh,    FFh
            obj.range = b.readInt8(0x45);
            // byte field20_0x46;
            obj.radius = b.readInt8(0x46);
            // byte field21_0x47;
            obj.aoeType = b.readInt8(0x47);
            // byte field22_0x48;
            obj._48 = b.readInt8(0x48);
            // undefined field23_0x49;
            obj._49 = b.readInt8(0x49);
            // undefined field24_0x4a;
            obj._4A = b.readInt8(0x4A);
            // undefined field25_0x4b;
            obj._4B = b.readInt8(0x4B);

            // dword field26_0x4c;
            const targets = b.readInt32LE(0x4C);
            obj._0x4c = [];
            for (let j = 0; j < 32; j++) {
                const flag = (1 << j);
                if ((targets & flag) !== 0) {
                    const targetTypes: Record<number, string> = {
                    }
                    let name: string|undefined = targetTypes[j];
                    if (!name) {
                        name = `${j}`;
                    }

                    obj._0x4c.push(name)
                }
            }

            // undefined field27_0x50;
            obj._50 = b.readInt8(0x50);
            // undefined field28_0x51;
            obj._51 = b.readInt8(0x51);
            // undefined field29_0x52;
            obj._52 = b.readInt8(0x52);
            // undefined field30_0x53;
            obj._53 = b.readInt8(0x53);
            // undefined field31_0x54;
            obj._54 = b.readInt8(0x54);
            // undefined field32_0x55;
            obj._55 = b.readInt8(0x55);
            // undefined field33_0x56;
            obj._56 = b.readInt8(0x56);
            // undefined field34_0x57;
            obj._57 = b.readInt8(0x57);
            // undefined field35_0x58;
            obj._58 = b.readInt8(0x58);
            // undefined field36_0x59;
            obj._59 = b.readInt8(0x59);
            // undefined field37_0x5a;
            obj._5A = b.readInt8(0x5A);
            // undefined field38_0x5b;
            obj._5B = b.readInt8(0x5B);
            // dword field39_0x5c;
            obj.giftsRequired = jobBitsToArray(b.readInt32LE(0x5C));
            // undefined field40_0x60;
            obj._60 = b.readInt8(0x60);
            // undefined field41_0x61;
            obj._61 = b.readInt8(0x61);
            // undefined field42_0x62;
            obj._62 = b.readInt8(0x62);
            // undefined field43_0x63;
            obj._63 = b.readInt8(0x63);

            mgc.push(obj);
        }
    }
}

writeFileSync(process.argv[3], JSON.stringify(mgc, null, 4));
