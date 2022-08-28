import { readFileSync, writeFileSync } from 'fs';

import { ItemDatabase } from '../common/resources/Item';

if (process.argv.length != 5) {
    console.error('Incorrect command line arguments!');
    process.exit(1);
}

const jDat = readFileSync(process.argv[2]);
const eDat = readFileSync(process.argv[3]);

const jItems = new ItemDatabase(jDat);
const eItems = new ItemDatabase(eDat);

if (jItems.entries.length !== eItems.entries.length) {
    console.error('Item database mismatch between Japanese and English!');
    process.exit(1);
}

for (let i = 0; i < jItems.entries.length; i++) {
    const jItem = jItems.entries[i];
    const eItem = eItems.entries[i];

    if (jItem.id !== eItem.id) {
        console.error(`Item id mismatch between Japanese (${jItem.id}) and English (${eItem.id})!`);
        process.exit(1);
    }

    if (jItem.iconTextureBase64 != eItem.iconTextureBase64) {
        console.error(`Item icon texture mismatch between Japanese (${jItem.id}) and English (${eItem.id})!`);
        process.exit(1);
    }
}

// DSP enum names

const flagBits = {
    WALLHANGING: 0x0001,
    UNKNOWN_01: 0x0002,
    MYSTERY_BOX: 0x0004,
    MOG_GARDEN: 0x0008,
    MAIL2ACCOUNT: 0x0010,
    INSCRIBABLE: 0x0020,
    NOAUCTION: 0x0040,
    SCROLL: 0x0080,
    LINKSHELL: 0x0100,
    CANUSE: 0x0200,
    CANTRADENPC: 0x0400,
    CANEQUIP: 0x0800,
    NOSALE: 0x1000,
    NODELIVERY: 0x2000,
    EX: 0x4000,
    RARE: 0x8000
};

const raceBits = {
    NONE: 1,
    HUME_M: 2,
    HUME_F: 4,
    ELVAAN_M: 8,
    ELVAAN_F: 16,
    TARU_M: 32,
    TARU_F: 64,
    MITHRA: 128,
    GALKA: 256,
    VIERA: 512,
};

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
};

const slotBits = {
    MAIN: 0x0001,
    SUB: 0x0002,
    RANGED: 0x0004,
    AMMO: 0x0008,
    HEAD: 0x0010,
    BODY: 0x0020,
    HANDS: 0x0040,
    LEGS: 0x0080,
    FEET: 0x0100,
    NECK: 0x0200,
    WAIST: 0x0400,
    EAR1: 0x0800,
    EAR2: 0x1000,
    RING1: 0x2000,
    RING2: 0x4000,
    BACK: 0x8000,
};

const skillNames = {
    NONE: 0,
    HAND_TO_HAND: 1,
    DAGGER: 2,
    SWORD: 3,
    GREAT_SWORD: 4,
    AXE: 5,
    GREAT_AXE: 6,
    SCYTHE: 7,
    POLEARM: 8,
    KATANA: 9,
    GREAT_KATANA: 10,
    CLUB: 11,
    STAFF: 12,
    AUTOMATON_MELEE: 22,
    AUTOMATON_RANGED: 23,
    AUTOMATON_MAGIC: 24,
    ARCHERY: 25,
    MARKSMANSHIP: 26,
    THROWING: 27,
    GUARD: 28,
    EVASION: 29,
    SHIELD: 30,
    PARRY: 31,
    DIVINE_MAGIC: 32,
    HEALING_MAGIC: 33,
    ENHANCING_MAGIC: 34,
    ENFEEBLING_MAGIC: 35,
    ELEMENTAL_MAGIC: 36,
    DARK_MAGIC: 37,
    SUMMONING_MAGIC: 38,
    NINJUTSU: 39,
    SINGING: 40,
    STRING_INSTRUMENT: 41,
    WIND_INSTRUMENT: 42,
    BLUE_MAGIC: 43,
    GEOMANCY: 44,
    HANDBELL: 45,
    FISHING: 48,
    WOODWORKING: 49,
    SMITHING: 50,
    GOLDSMITHING: 51,
    CLOTHCRAFT: 52,
    LEATHERCRAFT: 53,
    BONECRAFT: 54,
    ALCHEMY: 55,
    COOKING: 56,
    SYNERGY: 57,
    RID: 58,
    DIG: 59,

    // Two items are set to 255
    UNKNOWN_255: 255,
}

function flagBitsToArray(bits: number): string[] {
    const flags = [];

    for (const [flag, bit] of Object.entries(flagBits)) {
        if ((bit & bits) !== 0) {
            flags.push(flag);
        }
    }

    return flags;
}

function jobBitsToArray(bits: number): string[] {
    const jobs = [];

    for (const [job, bit] of Object.entries(jobBits)) {
        if ((bit & bits) !== 0) {
            jobs.push(job);
        }
    }

    return jobs;
}

function raceBitsToArray(bits: number): string[] {
    const races = [];

    for (const [race, bit] of Object.entries(raceBits)) {
        if ((bit & bits) !== 0) {
            races.push(race);
        }
    }

    return races;
}

function slotBitsToArray(bits: number): string[] {
    const slots = [];

    for (const [slot, bit] of Object.entries(slotBits)) {
        if ((bit & bits) !== 0) {
            slots.push(slot);
        }
    }

    return slots;
}

function skillToString(skill: number): string {
    for (const [skillName, id] of Object.entries(skillNames)) {
        if (skill === id) {
            return skillName;
        }
    }

    return `${skill}`;
}

const fieldNames = [
    'id',
    'type',
    'kind',
    'text',
    'flags',
    'stack',
    'targets',
    'level',
    'slots',
    'races',
    'jobs',
    'slvl',
    'skill',
    '_unk15',
    '_unk16',
    'shieldSize',
    'dmg',
    'delay',
    'dps',
    '_unk21',
    '_unk23',
    '_unk24',
    'emote',
    '_unk26',
    '_unk27',
    '_unk28',
    '_unk29',
    '_unk30',
    '_unk31',
    '_unk32',
    '_unk33',
    '_unk34',
    '_unk35',
    '_unk36',
    '_unk37',
    '_unk38',
    'ilvl',
    '_unk40',
    '_unk41',
    '_unk42',
    '_unk43',
    '_unk44',
    '_unk45',
    '_unk46',
    '_unk47',
    '_unk48',
    '_unk49',
    '_unk50',
    '_unk51',
    '_unk52',
    '_unk53',
    '_unk54',
    '_unk55',
    '_unk56',
    '_unk57',
    '_unk58',
    '_unk59',
    '_unk60',
    'iconTextureBase64',
];

// todo
// _unk52 - aoeModifier
// 1: YAGRUSH
// 2: EPEOLATRY
// 3: LUZAFS_RING
// 4: STRING_INSTRUMENT

const itemList = [];

for (let i = 0; i < jItems.entries.length; i++) {
    const jItem = jItems.entries[i];
    const eItem = eItems.entries[i];

    const item = {} as any;

    const _eItem: any = eItem; // Working around TS type-checking.

    for (const field of fieldNames) {
        if (_eItem[field] !== undefined) {
            if (field === 'text') {
                item.englishText = eItem.text;
                item.japaneseText = jItem.text;
            } else if (field === 'flags') {
                item.flags = flagBitsToArray(eItem.flags!);
            } else if (field === 'races') {
                item.races = raceBitsToArray(eItem.races!);
            } else if (field === 'jobs') {
                item.jobs = jobBitsToArray(eItem.jobs!);
            } else if (field === 'slots') {
                item.slots = slotBitsToArray(eItem.slots!);
            } else if (field === 'skill') {
                item.skill = skillToString(eItem.skill!);
            } else {
                item[field] = _eItem[field];
            }
        }
    }

    itemList.push(item);
}

writeFileSync(process.argv[4], JSON.stringify(itemList, null, 4));
