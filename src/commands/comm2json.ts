import { readFileSync, writeFileSync } from 'fs';

import { ChunkedResourceType, ChunkedResource } from '../common/resources/chunked-resource';

if (process.argv.length !== 4) {
    console.error('Incorrect command line arguments!');
    process.exit(1);
}

const menuDat = readFileSync(process.argv[2]);

const menuRes = new ChunkedResource(menuDat);

const comm: any = [];

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

for (let i = 0; i < menuRes.resources.length; i++) {
    const res = menuRes.resources[i];

    if (res.type == ChunkedResourceType.Acb && res.name === 'comm') {
        
        const numSpells = Math.floor(res.temp.length / 48);

        for (let s = 0; s < numSpells; s++) {
            const b = res.temp.slice(s * 48, (s + 1) * 48);

            const obj: any = {};

            // word id;
            obj.id = b.readInt16LE(0x00);
            // byte field1_0x2;
            obj.type = b.readInt8(0x02);
            // byte field2_0x3;
            obj.iconId = b.readInt8(0x03);
            // word field3_0x4;
            obj.icon2Id = b.readInt16LE(0x04);
            // word chargesRequired;
            obj.chargesRequired = b.readInt16LE(0x06);
            // word field5_0x8;
            obj._08 = b.readInt16LE(0x08);
            // undefined field6_0xa;
            obj.targets = b.readUInt16LE(0x0A);
            // word field8_0xc;
            obj._0C = b.readInt16LE(0x0C);
            // byte field9_0xe;
            obj._0E = b.readInt8(0x0E);
            // byte Level;
            obj.level = b.readInt8(0x0F);
            // byte field11_0x10;
            obj.range = b.readInt8(0x10);
            // byte field12_0x11;
            obj.radius = b.readInt8(0x11);
            // byte field13_0x12;
            obj.aoeType = b.readInt8(0x12);
            // byte field14_0x13;
            obj._13 = b.readInt8(0x13);
            // undefined field15_0x14;
            obj._14 = b.readInt8(0x14);
            // byte field16_0x15;
            obj._15 = b.readInt8(0x15);
            // word RadiusByTP[3];
            obj.radiusByTP = [];
            for (let l = 0; l < 3; l++) {
                obj.radiusByTP[l] = b.readInt16LE(0x16 + l * 2);
            }
            // word field18_0x1c;
            obj._1C = b.readInt16LE(0x1C);
            // word field19_0x1e;
            obj._1E = b.readInt16LE(0x1E);
            // undefined field20_0x20;
            obj._20 = b.readInt8(0x20);
            // undefined field21_0x21;
            obj._21 = b.readInt8(0x21);
            // word field22_0x22;
            obj._22 = b.readInt16LE(0x22);
            // undefined field23_0x24;
            obj._24 = b.readInt8(0x24);
            // undefined field24_0x25;
            obj._25 = b.readInt8(0x25);
            // undefined field25_0x26;
            obj._26 = b.readInt8(0x26);
            // undefined field26_0x27;
            obj._27 = b.readInt8(0x27);
            // undefined field27_0x28;
            obj._28 = b.readInt8(0x28);
            // undefined field28_0x29;
            obj._29 = b.readInt8(0x29);
            // undefined field29_0x2a;
            obj._2A = b.readInt8(0x2A);
            // undefined field30_0x2b;
            obj._2B = b.readInt8(0x2B);
            // undefined field31_0x2c;
            obj._2C = b.readInt8(0x2C);
            // undefined field32_0x2d;
            obj._2D = b.readInt8(0x2D);
            // undefined field33_0x2e;
            obj._2E = b.readInt8(0x2E);
            // undefined field34_0x2f;
            obj._2F = b.readInt8(0x2F);

            comm.push(obj);
        }
    }
}

writeFileSync(process.argv[3], JSON.stringify(comm, null, 4));
