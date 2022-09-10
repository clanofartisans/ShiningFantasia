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

//  1: Ability
//  2: Pet Ability
//  3: Weapon Skill
//  4: Job Trait
//  5: n/a
//  6: Blood Pact: Rage
//  7: n/a
//  8: Corsair's Roll
//  9: Quick Draw
// 10: Blood Pact: Ward
// 11: Samba
// 12: Waltz
// 13: Step
// 14: Flourish
// 15: Strategem
// 16: Jig
// 17: Flourish II
// 18: Ready
// 19: Flourish III
// 20: Monstrosity
// 21: Rune Enchantment
// 22: Ward
// 23: Effusion

const typeNames: Record<number, string> = {
    1: 'ABILITY',
    2: 'PET_ABILITY',
    3: 'WEAPON_SKILL',
    4: 'JOB_TRAIT',
    6: 'BLOOD_PACT_RAGE',
    8: 'CORSAIR_ROLL',
    9: 'QUICK_DRAW',
    10: 'BLOOD_PACT_WARD',
    11: 'SAMBA',
    12: 'WALTZ',
    13: 'STEP',
    14: 'FLOURISH',
    15: 'STRATEGEM',
    16: 'JIG',
    17: 'FLOURISH_II',
    18: 'READY',
    19: 'FLOURISH_III',
    20: 'MONSTROSITY',
    21: 'RUNE_ENCHANTMENT',
    22: 'WARD',
    23: 'EFFUSION',
}

function getType(type: number): string {
    return typeNames[type] ?? `${type}`;
}

function getTypeId(s: string): number {
    const typeId = getIndexFromValue2(s, typeNames);
    if (typeId < 0) {
        console.error(`Invalid type ${s}`);
        return 1;
    }

    return typeId;
}

if (process.argv.length !== 4 && process.argv.length !== 5) {
    console.error('Incorrect command line arguments!');
    console.error(`usage: ${process.argv[1]} <comm.json> <BASE 114.DAT> <NEW 114.DAT>`);
    console.error(`OR: ${process.argv[1]} <comm.json> <RAW COMM BIN OUTPUT>`);
    console.error(`NOTE: DAT splicing support may be deprecated in the future!`);
    process.exit(1);
}

const jsonData: any = readFileSync(process.argv[2]);

const commJson = JSON.parse(jsonData);

const comm = Buffer.alloc(48 * commJson.length);

for (let i = 0; i < commJson.length; i++) {
    const b = comm.subarray(i * 48);

    for (const [k, v] of Object.entries(commJson[i])) {
        switch (k) {
            case 'id': {
                b.writeUInt16LE(v as number, 0x00);
            }
            break;

            case 'type': {
                b.writeUInt8(getTypeId(v as string), 0x02);
            }
            break;

            case 'iconId': {
                b.writeInt8(v as number, 0x03);
            }
            break;

            case 'icon2Id': {
                b.writeInt16LE(v as number, 0x04);
            }
            break;

            case 'chargesRequired': {
                b.writeInt16LE(v as number, 0x06);
            }
            break;

            case 'targets': {
                b.writeUInt16LE(getTargetBits(v as string[]), 0x0A);
            }
            break;

            case 'tpCost': {
                b.writeInt16LE(v as number, 0x0C);
            }
            break;

            case 'level': {
                b.writeInt8(v as number, 0x0F);
            }
            break;

            case 'range': {
                b.writeInt8(v as number, 0x10);
            }
            break;

            case 'radius': {
                b.writeInt8(v as number, 0x11);
            }
            break;

            case 'aoeType': {
                b.writeInt8(v as number, 0x12);
            }
            break;

            case 'validTargets': {
                b.writeUInt16LE(getValidTargetId(v as string), 0x13);
            }
            break;

            case 'tpModifier': {
                b.writeInt8(v as number, 0x15);
            }
            break;

            case 'tpModifierValues': {
                for (let l = 0; l < 3; l++) {
                    const vv = v as number[]
                    b.writeInt16LE(vv[l], 0x16 + l * 2);
                }
            }
            break;

            case '_08': {
                b.writeInt16LE(v as number, 0x08);
            }
            break;

            case '_0E': {
                b.writeInt8(v as number, 0x0E);
            }
            break;

            case '_14': {
                b.writeInt8(v as number, 0x14);
            }
            break;

            case '_1C': {
                b.writeInt16LE(v as number, 0x1C);
            }
            break;

            case '_1E': {
                b.writeInt16LE(v as number, 0x1E);
            }
            break;

            case '_20': {
                b.writeInt8(v as number, 0x20);
            }
            break;

            case '_21': {
                b.writeInt8(v as number, 0x21);
            }
            break;

            case '_22': {
                b.writeInt16LE(v as number, 0x22);
            }
            break;

            case '_24': {
                b.writeInt8(v as number, 0x24);
            }
            break;

            case '_25': {
                b.writeInt8(v as number, 0x25);
            }
            break;

            case '_26': {
                b.writeInt8(v as number, 0x26);
            }
            break;

            case '_27': {
                b.writeInt8(v as number, 0x27);
            }
            break;

            case '_28': {
                b.writeInt8(v as number, 0x28);
            }
            break;

            case '_29': {
                b.writeInt8(v as number, 0x29);
            }
            break;

            case '_2A': {
                b.writeInt8(v as number, 0x2A);
            }
            break;

            case '_2B': {
                b.writeInt8(v as number, 0x2B);
            }
            break;

            case '_2C': {
                b.writeInt8(v as number, 0x2C);
            }
            break;

            case '_2D': {
                b.writeInt8(v as number, 0x2D);
            }
            break;

            case '_2E': {
                b.writeInt8(v as number, 0x2E);
            }
            break;

            case '_2F': {
                b.writeInt8(v as number, 0x2F);
            }
            break;

        }
    }
}

encodeMgc_(comm, 48);

if (process.argv.length === 4) {
    writeFileSync(process.argv[3], comm);
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

        if (type === ChunkedResourceType.Acb && name === 'comm') {
            const header = Buffer.alloc(16);

            // 'comm'
            header[0] = 99;
            header[1] = 111;
            header[2] = 109;
            header[3] = 109;

            header.writeUInt32LE((ChunkedResourceType.Acb) | (((comm.length + 16) >> 4) << 7) | (flags << 28), 4);
            chunks.push(header);
            chunks.push(comm);
        } else {
            chunks.push(resBuf);
        }
    }

    const outBin = Buffer.concat(chunks);
    writeFileSync(process.argv[4], outBin);
}
