import { readFileSync, writeFileSync } from 'fs';

import { Dmsg } from '../common/resources/dmsg';

if (process.argv.length != 5) {
    console.error('Incorrect command line arguments!');
    process.exit(1);
}

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
