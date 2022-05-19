import { readFileSync, writeFileSync } from 'fs';

import { Item, exportDat } from '../common/resources/Item';

///
// DSP enum names

const flagBits: Record<string, number> = {
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

const raceBits: Record<string, number> = {
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

const jobBits: Record<string, number> = {
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

const slotBits: Record<string, number> = {
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

const skillNames: Record<string, number> = {
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

function arrayToFlagBits(flags: string[]): number {
    let bits = 0;

    for (const flag of flags) {
        bits |= flagBits[flag];
    }

    return bits;
}

function arrayToJobBits(jobs: string[]): number {
    let bits = 0;

    for (const job of jobs) {
        bits |= jobBits[job];
    }

    return bits;
}

function arrayToRaceBits(races: string[]): number {
    let bits = 0;

    for (const race of races) {
        bits |= raceBits[race];
    }

    return bits;
}

function arrayToSlotBits(slots: string[]): number {
    let bits = 0;

    for (const slot of slots) {
        bits |= slotBits[slot];
    }

    return bits;
}

function stringToSkill(skill: string): number {
    if (skill in skillNames) {
        return skillNames[skill];
    }

    // hope for the best!
    return parseInt(skill, 10);
}

///
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

if (process.argv.length != 5) {
    console.error('Incorrect command line arguments!');
    process.exit(1);
}

const jsonData: any = readFileSync(process.argv[2]);

const itemsJson = JSON.parse(jsonData);

const eDats: Item[] = [];
const jDats: Item[] = [];

for (let i = 0; i < itemsJson.length; i++) {

    const item = itemsJson[i];

    let eItem: any = {};
    let jItem: any = {};

    for (const field of Object.keys(item)) {
        if (field === 'englishText') {
            eItem.text = item.englishText;
        } else if (field == 'japaneseText') {
            jItem.text = item.japaneseText;
        } else if (field === 'flags') {
            item.flags = arrayToFlagBits(item.flags!);
        } else if (field === 'races') {
            item.races = arrayToRaceBits(item.races!);
        } else if (field === 'jobs') {
            item.jobs = arrayToJobBits(item.jobs!);
        } else if (field === 'slots') {
            item.slots = arrayToSlotBits(item.slots!);
        } else if (field === 'skill') {
            item.skill = stringToSkill(item.skill!);
        }
    }

    delete item.englishText;
    delete item.japaneseText;

    eItem = { ...item, ...eItem };
    jItem = { ...item, ...jItem };

    // YOLO
    eDats.push(eItem);
    jDats.push(jItem);
}

const eBin = exportDat(eDats);
const jBin = exportDat(jDats);

writeFileSync(process.argv[3], jBin);
writeFileSync(process.argv[4], eBin);
