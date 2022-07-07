import { readFileSync, writeFileSync } from 'fs';

import { Dmsg } from '../common/resources/dmsg';

if (process.argv.length !== 4 && process.argv.length !== 5) {
    console.error('Incorrect command line arguments!');
    process.exit(1);
}

if (process.argv.length === 5) {
    // Dual-language mode.
    const jDat = readFileSync(process.argv[2]);
    const eDat = readFileSync(process.argv[3]);

    const jDmsg = new Dmsg(jDat);
    const eDmsg = new Dmsg(eDat);

    const dmsgJson = [];

    const numEntries = Math.max(jDmsg.entries.length, eDmsg.entries.length);

    for (let i = 0; i < numEntries; i++) {
        const jEntry = i < jDmsg.entries.length ? jDmsg.entries[i] : null;
        const eEntry = i < eDmsg.entries.length ? eDmsg.entries[i] : null;

        dmsgJson.push({
            _id: i,
            englishText: eEntry,
            japaneseText: jEntry,
        })
    }

    writeFileSync(process.argv[4], JSON.stringify(dmsgJson, null, 4));
} else {
    // Single-language mode.
    const eDat = readFileSync(process.argv[2]);

    const eDmsg = new Dmsg(eDat);

    const dmsgJson = [];

    const numEntries = eDmsg.entries.length;

    for (let i = 0; i < numEntries; i++) {
        const eEntry = eDmsg.entries[i];

        dmsgJson.push({
            _id: i,
            text: eEntry,
        })
    }

    writeFileSync(process.argv[3], JSON.stringify(dmsgJson, null, 4));
}
