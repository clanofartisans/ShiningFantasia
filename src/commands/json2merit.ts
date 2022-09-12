import { readFileSync, writeFileSync } from 'fs';

if (process.argv.length !== 4) {
    console.error('Incorrect command line arguments!');
    process.exit(1);
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

function arrayToJobBits(jobs: string[]): number {
    let bits = 0;

    for (const job of jobs) {
        bits |= jobBits[job];
    }

    return bits;
}

const jsonData: any = readFileSync(process.argv[2]);

const meritJson = JSON.parse(jsonData);

const merit: any[] = [];

for (let i = 0; i < meritJson.length; i++) {
    const mObj = meritJson[i];

    const meritBuf = Buffer.alloc(12);

    //  word id; byte category; byte index; byte maxMerits; byte dontknow0; byte dontknow1; byte dontknow2; dword jobMask

    meritBuf.writeUInt16LE(mObj.id, 0x00);
    meritBuf.writeUInt8(mObj.category, 0x02);
    meritBuf.writeUInt8(mObj.index, 0x03);
    meritBuf.writeUInt8(mObj.maxMerits, 0x04);
    meritBuf.writeUInt8(mObj._05, 0x05);
    meritBuf.writeUInt8(mObj._06, 0x06);
    meritBuf.writeUInt8(mObj._07, 0x07);
    meritBuf.writeUInt32LE(arrayToJobBits(mObj.jobs), 0x08);

    merit.push(meritBuf);
}

const outBin = Buffer.concat(merit);
writeFileSync(process.argv[3], outBin);
