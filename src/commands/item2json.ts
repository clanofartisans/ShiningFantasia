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

const fieldNames = [
    'id',
    'type',
    '_unk0',
    'text',
    '_unk2',
    'stack',
    '_unk4',
    'level',
    'slots',
    'races',
    'jobs',
    '_unk11',
    'skill',
    '_unk15',
    '_unk16',
    '_unk17',
    'dmg',
    'delay',
    '_unk20',
    '_unk21',
    '_unk23',
    '_unk24',
    '_unk25',
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
    '_unk39',
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

const itemList = [];

for (let i = 0; i < jItems.entries.length; i++) {
    const jItem = jItems.entries[i];
    const eItem = eItems.entries[i];

    const item = {} as any;

    for (const field of fieldNames) {
        if (field in jItem) {
            if (field === 'text') {
                item.englishText = eItem.text;
                item.japaneseText = jItem.text;
            } else {
                const _jItem: any = jItem; // Working around TS type-checking.
                item[field] = _jItem[field];
            }
        }
    }

    itemList.push(item);
}

writeFileSync(process.argv[4], JSON.stringify(itemList, null, 4));
