import { readFileSync, writeFileSync } from 'fs';

import { ChunkedResourceType, ChunkedResource } from '../common/resources/chunked-resource';

if (process.argv.length !== 4) {
    console.error('Incorrect command line arguments!');
    process.exit(1);
}

const menuDat = readFileSync(process.argv[2]);

const menuRes = new ChunkedResource(menuDat);

const comm: any = [];

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
for (let i = 0; i < menuRes.resources.length; i++) {
    const res = menuRes.resources[i];

    if (res.type == ChunkedResourceType.Acb && res.name === 'comm') {
        
        const numComm = Math.floor(res.temp.length / 48);

        for (let s = 0; s < numComm; s++) {
            const b = res.temp.slice(s * 48, (s + 1) * 48);

            const obj: any = {};

            obj.id = b.readInt16LE(0x00);
            obj.type = getType(b.readUInt8(0x02));
            obj.iconId = b.readInt8(0x03);
            obj.icon2Id = b.readInt16LE(0x04);
            obj.chargesRequired = b.readInt16LE(0x06);
            obj.targets = getTargets(b.readUInt16LE(0x0A));
            obj.tpCost = b.readInt16LE(0x0C);
            obj.level = b.readInt8(0x0F);
            obj.range = b.readInt8(0x10);
            obj.radius = b.readInt8(0x11);
            obj.aoeType = b.readInt8(0x12);
            obj.validTargets = getValidTargets(b.readUInt16LE(0x13));
            obj.tpModifier = b.readInt8(0x15);
            obj.tpModifierValues = [];
            for (let l = 0; l < 3; l++) {
                obj.tpModifierValues[l] = b.readInt16LE(0x16 + l * 2);
            }

            obj._08 = b.readInt16LE(0x08);
            obj._0E = b.readInt8(0x0E);
            obj._14 = b.readInt8(0x14);
            obj._1C = b.readInt16LE(0x1C);
            obj._1E = b.readInt16LE(0x1E);
            obj._20 = b.readInt8(0x20);
            obj._21 = b.readInt8(0x21);
            obj._22 = b.readInt16LE(0x22);
            obj._24 = b.readInt8(0x24);
            obj._25 = b.readInt8(0x25);
            obj._26 = b.readInt8(0x26);
            obj._27 = b.readInt8(0x27);
            obj._28 = b.readInt8(0x28);
            obj._29 = b.readInt8(0x29);
            obj._2A = b.readInt8(0x2A);
            obj._2B = b.readInt8(0x2B);
            obj._2C = b.readInt8(0x2C);
            obj._2D = b.readInt8(0x2D);
            obj._2E = b.readInt8(0x2E);
            obj._2F = b.readInt8(0x2F);

            comm.push(obj);
        }
    }
}

writeFileSync(process.argv[3], JSON.stringify(comm, null, 4));
