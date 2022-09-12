import { readFileSync, writeFileSync } from 'fs';

import { Dmsg } from '../common/resources/dmsg';

if (process.argv.length !== 4 && process.argv.length !== 5) {
    console.error('Incorrect command line arguments!');
    console.error(`usage: ${process.argv[1]} <two language dmsg.json> <Japanese Dmsg Dat Output> <English Dmsg Dat Output>`);
    console.error(`OR: ${process.argv[1]} <one language dmsg.json> <Dmsg Dat Output>`);
    process.exit(1);
}

const jsonData: any = readFileSync(process.argv[2]);

const dmsgJson = JSON.parse(jsonData);

const [eBuf, jBuf] = Dmsg.export(dmsgJson)

if ((jBuf === null) && process.argv.length === 5) {
    console.error('JSON is missing the Japanese version; remove the second output filename.');
    process.exit(1);
}

if ((jBuf !== null) && process.argv.length === 4) {
    console.warn('JSON is a two language version; Ignoring Japanese version!');
}

if (process.argv.length === 4) {
    writeFileSync(process.argv[3], eBuf);
}

if (process.argv.length === 5) {
    writeFileSync(process.argv[3], jBuf!);
    writeFileSync(process.argv[4], eBuf);
}
