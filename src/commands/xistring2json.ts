import { readFileSync, writeFileSync } from 'fs';

import { XiString } from '../common/resources/xistring';

if (process.argv.length !== 4 && process.argv.length !== 5) {
    console.error('Incorrect command line arguments!');
    process.exit(1);
}

if (process.argv.length === 5) {
    // Dual-language mode.
    const jDat = readFileSync(process.argv[2]);
    const eDat = readFileSync(process.argv[3]);

    const jXiString = new XiString(jDat);
    const eXiString = new XiString(eDat);

    const xistringJson = [];

    const numEntries = Math.max(jXiString.entries.length, eXiString.entries.length);

    for (let i = 0; i < numEntries; i++) {
        const jEntry = i < jXiString.entries.length ? jXiString.entries[i] : null;
        const eEntry = i < eXiString.entries.length ? eXiString.entries[i] : null;

        xistringJson.push({
            _id: i,
            englishText: eEntry,
            japaneseText: jEntry,
        })
    }

    writeFileSync(process.argv[4], JSON.stringify(xistringJson, null, 4));
} else {
    // Single-language mode.
    const eDat = readFileSync(process.argv[2]);

    const eXiString = new XiString(eDat);

    const xistringJson = [];

    const numEntries = eXiString.entries.length;

    for (let i = 0; i < numEntries; i++) {
        const eEntry = eXiString.entries[i];

        xistringJson.push({
            _id: i,
            text: eEntry,
        })
    }

    writeFileSync(process.argv[3], JSON.stringify(xistringJson, null, 4));
}
