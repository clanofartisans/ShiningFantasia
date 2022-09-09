import { readFileSync, writeFileSync } from 'fs';

import { lsb32 } from '../common/bytes';
import { encode as encodeMgc_ } from '../common/mgc-decode';
import { decodeString } from '../common/string';
import { ChunkedResourceType } from '../common/resources/chunked-resource';

// Lame copy-paste but who cares. :)

function getIndexFromValue(s: string, r: Record<number, string>): number {
    for (const [k, v] of Object.entries(r)) {
        if (v === s) {
            return parseInt(k, 10);
        }
    }

    return -1;
}

function getIndexFromValue2(s: string, r: Record<number, string>): number {
    let v = getIndexFromValue(s, r);

    if (v < 0) {
        v = parseInt(s, 10);
        if (isNaN(v)) {
            return -1;
        }
    }

    return v;
}

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

function getMagicTypeId(s: string): number {
    const id = magicTypes.indexOf(s);
    if (id < 0) {
        console.error(`Invalid magic type ${s}`);
        return 0;
    }
    return id;
}

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

function getElementId(s: string): number {
    const ele = getIndexFromValue(s, elementNames);
    if (ele < 0) {
        console.error(`Invalid element ${s}`);
        return 15;
    }

    return ele;
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
// 80 0002 1800 npc, excluding fellows

// 0001 pc
// 0002 npc
// 0004 party
// 0008 alliance
// 0010 mob
// 0020 door
// 0040 lift
// 0080 model (furniture, etc.)
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

function getTargetBits(s: string[]): number {
    let bits = 0;

    for (const t of s) {
        const v = getIndexFromValue2(t, targetBits);
        if (v < 0) {
            console.error(`Invalid target ${t}`);
            continue;
        }

        bits |= (1 << v);
    }

    return bits;
}

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

function skillToString(skill: number): string {
    for (const [skillName, id] of Object.entries(skillNames)) {
        if (skill === id) {
            return skillName;
        }
    }

    return `${skill}`;
}

function stringToSkill(skill: string): number {
    if (skill in skillNames) {
        return skillNames[skill];
    }

    const v = parseInt(skill, 10);
    if (isNaN(v)) {
        console.error(`Unknown skill ${skill}`);
        return 0;
    }

    return v;
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

function getLevelBuffer(jobs: Record<string, number>): Buffer {
    const b = Buffer.alloc(24 * 2);

    // auto-fill with -1
    b.fill(0xFF);

    for (const [job, level] of Object.entries(jobs)) {
        const jobId = jobNames.indexOf(job);
        if (jobId < 0) {
            console.error(`Invalid job ${job}`);
            continue;
        }

        b.writeInt16LE(level, jobId * 2);
    }

    return b;
}

const modifierNames: Record<number, string> = {
    0: 'ACCESSION',
    1: 'MANIFESTATION',
    2: 'ADDENDUM',
    3: 'TABULA_RASA',
    4: 'ELEMENTAL_SEAL',
    5: 'GEOCOLURE',
    6: 'THEURGIC_FOCUS',
    7: 'CONSUME_ALL_MP',
};

function getModifiers(bits: number): string[] {
    const flags = [];

    for (let i = 0; i < 8; i++) {
        if (((1 << i) & bits) !== 0) {
            const modifierName = modifierNames[i] ?? `${i}`;
            flags.push(modifierName);
        }
    }

    return flags;
}

function getModifierBits(s: string[]): number {
    let bits = 0;

    for (const m of s) {
        const v = getIndexFromValue2(m, modifierNames);
        if (v < 0) {
            console.error(`Invalid modifier ${m}`);
            continue;
        }

        bits |= (1 << v);
    }

    return bits;
}

const aoeTypeNames: Record<number, string> = {
    0: 'NONE',
    1: 'TARGET_AOE',
    2: 'SELF_CONAL',
    3: 'SELF_AOE',
};

function getAoeType(type: number): string {
    return aoeTypeNames[type] ?? `${type}`;
}

function getAoeId(s: string): number {
    const aoe = getIndexFromValue(s, aoeTypeNames);
    if (aoe < 0) {
        console.error(`Invalid AoE Type ${s}`);
        return 0;
    }

    return aoe;
}

const validTargetsNames: Record<number, string> = {
    0: 'ALL',
    1: 'SELF',
    2: 'SELF_AOE',
    3: 'SELF_AOE2', // teleports, escape
    // 4 - unused
    5: 'MOB_SELFAOE',
    6: 'PARTY',
    7: 'PARTY_AOE',
    8: 'LUOPAN',
    9: 'PET',
    10: 'PC',
    // 11 - unused
    12: 'SELF_PET',
    13: 'MOB',
    14: 'MOB_AOE',
    15: 'DEAD',
}

function getValidTargets(kind: number): string {
    return validTargetsNames[kind] ?? `${kind}`;
}

function getValidTargetId(s: string): number {
    const vt = getIndexFromValue2(s, validTargetsNames);
    if (vt < 0) {
        console.error(`Invalid Valid Target Type ${s}`);
        return 0;
    }

    return vt;
}

const magicKinds: Record<number, string> = {
    0: 'BLUE_MAGIC',
    1: 'OFFENSIVE',
    2: 'CURE',
    3: 'STATUS_EFFECT',
    4: 'STATUS_REMOVAL',
    // 5 - unused
    6: 'DEFENSIVE_SONG',
    7: 'OFFENSIVE_SONG',
    8: 'DRAIN',
    9: 'ASPIR',
    // 10 - unused
    11: 'ELEMENTAL_DEBUFF',
    12: 'TELEPORT', // including recall, warp, escape
    13: 'RAISE',
    14: 'FINALE',
    15: 'TRACTOR',
    16: 'SUMMON', // including trusts
    17: 'ABSORB_STAT',
    18: 'DISPEL', // including erase
    19: 'VIRELEI',
    20: 'DEATH',
    // 21 - unused
    // 22 - unused
    // 23 - unused
    // 24 - unused
    // 25 - unused
    // 26 - unused
    // 27 - unused
    28: 'HELIX',
    29: 'COLURE',
    // 30 - unused
    31: 'OTHER', // meteor, aquaveil, sacrifice, esuna, absorb-tp, boost, gain
};

function getModifiersEx(bits: number): Record<string, string|boolean> {
    const a =               (bits &          3);
    const b =               (bits &       0x78) >> 3;
    const kind =            (bits &   0x7fff80) >> 7;

    // same as the other modifier bits
    const isAccession =     (bits &   0x800000) !== 0;
    const isManifestation = (bits &  0x1000000) !== 0;
    const isAddendum =      (bits & 0x02000000) !== 0;
    const isTabulaRasa =    (bits & 0x04000000) !== 0;
    const isElementalSeal = (bits & 0x08000000) !== 0;
    const isGeocolure =     (bits & 0x10000000) !== 0;
    const isTheurgicFocus = (bits & 0x20000000) !== 0;
    const isConsumeAllMP =  (bits & 0x40000000) !== 0;

    // unknown / unused
    const h =               (bits & 0x80000000) !== 0;

    const ret: any = {};

    if (true) {
        // an enum of some sort: 0 (tends to be offensive spells), 1 (tends to be defensive spells), 2 (tends to be defensive blue mage spells, Odin, Atomos)
        // Used by Convergence
        ret['A'] = `${a}`;
    }
    if (b) {
        // Unknown?
        // Used by Convergence
        ret['B'] = `${b}`;
    }
    if (kind||true) {

        ret['KIND'] = magicKinds[kind] ?? `${kind}`;
    }
    if (isAccession) {
        ret['ACCESSION'] = isAccession;
    }
    if (isManifestation) {
        ret['MANIFESTATION'] = isManifestation;
    }
    if (isAddendum) {
        ret['ADDENDUM'] = isAddendum;
    }
    if (isTabulaRasa) {
        ret['TABULA_RASA'] = isTabulaRasa;
    }
    if (isElementalSeal) {
        ret['ELEMENTAL_SEAL'] = isElementalSeal;
    }
    if (isGeocolure) {
        ret['GEOCOLURE'] = isGeocolure;
    }
    if (isTheurgicFocus) {
        ret['THEURGIC_FOCUS'] = isTheurgicFocus;
    }
    if (isConsumeAllMP) {
        ret['CONSUME_ALL_MP'] = isConsumeAllMP;
    }
    if (h) {
        // unused
        ret['H'] = h;
    }

    return ret;
}

function getModifierExBits(ex: Record<string, string|boolean>): number {
    let bits = 0;

    /*
    const a =               (bits &          3);
    const b =               (bits &       0x78) >> 3;
    const kind =            (bits &   0x7fff80) >> 7;

    // same as the other modifier bits
    const isAccession =     (bits &   0x800000) !== 0;
    const isManifestation = (bits &  0x1000000) !== 0;
    const isAddendum =      (bits & 0x02000000) !== 0;
    const isTabulaRasa =    (bits & 0x04000000) !== 0;
    const isElementalSeal = (bits & 0x08000000) !== 0;
    const isGeocolure =     (bits & 0x10000000) !== 0;
    const isTheurgicFocus = (bits & 0x20000000) !== 0;
    const isConsumeAllMP =  (bits & 0x40000000) !== 0;

    // unknown / unused
    const h =               (bits & 0x80000000) !== 0;
    */

    for (const [k, v] of Object.entries(ex)) {
        if (k === 'A') {
            const a = parseInt(v as string, 10);
            if (isNaN(a) || a < 0 || a > 3) {
                console.error(`Invalid A value ${v}`);
            } else {
                bits |= a;
            }
        } else if (k === 'B') {
            const b = parseInt(v as string, 10);
            if (isNaN(b) || b < 0 || b > 15) {
                console.error(`Invalid B value ${v}`);
            } else {
                bits |= (b << 3);
            }
        } else if (k === 'KIND') {
            const kind = getIndexFromValue2(v as string, magicKinds);
            if (kind < 0 || kind > 65535) {
                console.error(`Invalid maic kind ${v}`);
            } else {
                bits |= (kind << 7);
            }
        } else if (k === 'ACCESSION') {
            if (v === true) {
                bits |= 0x800000;
            }
        } else if (k === 'MANIFESTATION') {
            if (v === true) {
                bits |= 0x1000000;
            }
        } else if (k === 'ADDENDUM') {
            if (v === true) {
                bits |= 0x02000000;
            }
        } else if (k === 'TABULA_RASA') {
            if (v === true) {
                bits |= 0x04000000;
            }
        } else if (k === 'ELEMENTAL_SEAL') {
            if (v === true) {
                bits |= 0x08000000;
            }
        } else if (k === 'GEOCOLURE') {
            if (v === true) {
                bits |= 0x10000000;
            }
        } else if (k === 'THEURGIC_FOCUS') {
            if (v === true) {
                bits |= 0x20000000;
            }
        } else if (k === 'CONSUME_ALL_MP') {
            if (v === true) {
                bits |= 0x40000000;
            }
        } else if (k === 'H') {
            if (v === true) {
                bits |= 0x80000000;
            }
        }
    }

    return bits;
}

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

function arrayToJobBits(s: string[]): number {
    let bits = 0;

    for (const job of s) {
        const bit = jobBits[job];

        if (!bit) {
            console.error(`Invalid Gift Job ${job}`);
        } else {
            bits |= bit;
        }
    }
    return bits;
}

if (process.argv.length !== 4 && process.argv.length !== 5) {
    console.error('Incorrect command line arguments!');
    console.error(`usage: ${process.argv[1]} <mgc.json> <BASE 114.DAT> <NEW 114.DAT>`);
    console.error(`OR: ${process.argv[1]} <mgc.json> <RAW MGC BIN OUTPUT>`);
    console.error(`NOTE: DAT splicing support may be deprecated in the future!`);
    process.exit(1);
}

const jsonData: any = readFileSync(process.argv[2]);

const mgcJson = JSON.parse(jsonData);

const mgc = Buffer.alloc(100 * mgcJson.length);

for (let i = 0; i < mgcJson.length; i++) {
    const b = mgc.subarray(i * 100);

    for (const [k, v] of Object.entries(mgcJson[i])) {
        switch (k) {
            case 'id': {
                b.writeUInt16LE(v as number, 0x00);
            }
            break;

            case 'magicType': {
                b.writeUInt16LE(getMagicTypeId(v as string), 0x02);
            }
            break;

            case 'element': {
                b.writeUInt16LE(getElementId(v as string), 0x04);
            }
            break;

            case 'targets': {
                b.writeUInt16LE(getTargetBits(v as string[]), 0x06);
            }
            break;

            case 'skill': {
                b.writeUInt16LE(stringToSkill(v as string), 0x08);
            }
            break;

            case 'mpCost': {
                b.writeUInt16LE(v as number, 0x0A);
            }
            break;

            case 'castTime': {
                b.writeUInt8(v as number, 0x0C);
            }
            break;

            case 'recastTime': {
                b.writeUInt8(v as number, 0x0D);
            }
            break;

            case 'levels': {
                b.fill(getLevelBuffer(v as Record<string, number>), 0x0E, 0x3E);
            }
            break;

            case 'iconId': {
                b.writeInt16LE(v as number, 0x40);
            }
            break;

            case 'icon2Id': {
                b.writeInt16LE(v as number, 0x42);
            }
            break;

            case 'modifiers': {
                b.writeUInt8(getModifierBits(v as string[]), 0x44);
            }
            break;

            case 'range': {
                b.writeInt8(v as number, 0x45);
            }
            break;

            case 'radius': {
                b.writeInt8(v as number, 0x46);
            }
            break;

            case 'aoeType': {
                b.writeUInt16LE(getAoeId(v as string), 0x47);
            }
            break;

            case 'validTargets': {
                b.writeUInt32LE(getValidTargetId(v as string), 0x48);
            }
            break;

            case 'modifiersEx': {
                b.writeUInt32LE(getModifierExBits(v as Record<string, string|boolean>), 0x4C);
            }
            break;

            case 'giftsRequired': {
                b.writeUInt32LE(arrayToJobBits(v as string[]), 0x5C);
            }
            break;

            case '_3E': {
                b.writeUInt16LE(v as number, 0x3E);
            }
            break;

            case '_50': {
                b.writeUInt32LE(parseInt(v as string, 16), 0x50);
            }
            break;

            case '_54': {
                b.writeUInt32LE(parseInt(v as string, 16), 0x54);
            }
            break;

            case '_58': {
                b.writeUInt32LE(parseInt(v as string, 16), 0x58);
            }
            break;

            case '_60': {
                b.writeUInt32LE(parseInt(v as string, 16), 0x60);
            }
            break;

            default: {
                console.error(`entry ${i} has unsupported field ${k}, ignoring...`);
            }
            break;
        }
    }
}

encodeMgc_(mgc, 100);

if (process.argv.length === 4) {
    writeFileSync(process.argv[3], mgc);
} else {
    const menuDat = readFileSync(process.argv[3]);

    const chunks: Buffer[] = [];

    let offset = 0;
    const b = menuDat;

    while (offset <= b.length - 16) {
        const name = decodeString(b.subarray(offset, offset + 4));

        const header0 = lsb32(b, offset + 4);
        const header1 = lsb32(b, offset + 8);
        const header2 = lsb32(b, offset + 12);

        const type = header0 & 0x7f;
        const length = (((header0 & 0xfffffff) >> 7) << 4) - 16;
        const flags = (header0 >> 28);

        if (b.length - offset < length + 16) {
            throw new Error('Corrupt Resource DAT');
        }

        let resBuf = b.subarray(offset, offset + length + 16);
        offset += 16;
        offset += length;

        if (type === ChunkedResourceType.Mgb && name === 'mgc_') {
            const header = Buffer.alloc(16);

            header[0] = 109;
            header[1] = 103;
            header[2] = 99;
            header[3] = 95;

            header.writeUInt32LE((ChunkedResourceType.Mgb) | (((mgc.length + 16) >> 4) << 7) | (flags << 28), 4);
            chunks.push(header);
            chunks.push(mgc);
        } else {
            chunks.push(resBuf);
        }
    }

    const outBin = Buffer.concat(chunks);
    writeFileSync(process.argv[4], outBin);
}

/*
const menuRes = new ChunkedResource(menuDat);

const mgc: any = [];

for (let i = 0; i < menuRes.resources.length; i++) {
    const res = menuRes.resources[i];

    if (res.type == ChunkedResourceType.Mgb && res.name === 'mgc_') {

        const numSpells = Math.floor(res.temp.length / 100);

        for (let s = 0; s < numSpells; s++) {
            const b = res.temp.subarray(s * 100, (s + 1) * 100);

            const obj: any = {};

            obj.id = b.readUInt16LE(0x00);
            obj.magicType = magicTypes[b.readUInt16LE(0x02)];
            obj.element = getElementName(b.readUInt16LE(0x04));
            obj.targets = getTargets(b.readUInt16LE(0x06));
            obj.skill = skillToString(b.readUInt16LE(0x08));
            obj.mpCost = b.readUInt16LE(0x0A);
            obj.castTime = b.readUInt8(0x0C);
            obj.recastTime = b.readUInt8(0x0D);
            obj.levels = {};
            for (let l = 0; l < 24; l++) {
                const level = b.readInt16LE(0x0E + l * 2);
                if (level > -1) {
                    obj.levels[jobNames[l]] = level;
                }
            }
            obj.iconId = b.readInt16LE(0x40);
            obj.icon2Id = b.readInt16LE(0x42);
            obj.modifiers = getModifiers(b.readUInt8(0x44));
            // 0: 0
            // 1: 1
            // 2: 3
            // 3: 4
            // 4: 5
            // 5: 6
            // 6: 7
            // 7: 8
            // 8: 10
            // 9: 12
            // 10: 14
            // 11: 16
            // 12: 20
            // 13: 23
            // 14: 30
            // 15: 255

            // 0h,     1h,     3h,     4h
            // 5h,     6h,     7h,     8h
            // Ah,     Ch,     Eh,    10h
            // 14h,    19h,    1Eh,    FFh
            obj.range = b.readInt8(0x45);
            obj.radius = b.readInt8(0x46);
            obj.aoeType = getAoeType(b.readUInt8(0x47));
            obj.validTargets = getValidTargets(b.readUInt32LE(0x48));
            obj.modifiersEx = getModifiersEx(b.readUInt32LE(0x4C));
            obj.giftsRequired = jobBitsToArray(b.readUInt32LE(0x5C));

            // some other unique identifier
            obj._3E = b.readUInt16LE(0x3E);

            // magic type / kind-specific data
            obj._50 = b.readUInt32LE(0x50).toString(16).toUpperCase().padStart(8, '0');
            obj._54 = b.readUInt32LE(0x54).toString(16).toUpperCase().padStart(8, '0');
            obj._58 = b.readUInt32LE(0x58).toString(16).toUpperCase().padStart(8, '0');

            // trailer byte ff
            obj._60 = b.readUInt32LE(0x60).toString(16).toUpperCase().padStart(8, '0');

            mgc.push(obj);
        }
    }
}

writeFileSync(process.argv[3], JSON.stringify(mgc, null, 4));
*/