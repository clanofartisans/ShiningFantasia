import { readFileSync, writeFileSync } from 'fs';

if (process.argv.length !== 4) {
    console.error('Incorrect command line arguments!');
    process.exit(1);
}

const meritBuf = readFileSync(process.argv[2]);

if ((meritBuf.length % 12) !== 0) {
    console.error('Invalid merit dat!');
    process.exit(1);
}

const merit: any[] = [];

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

for (let i = 0; i < meritBuf.length; i += 12) {
    //  word id; byte category; byte index; byte maxMerits; byte dontknow0; byte dontknow1; byte dontknow2; dword jobMask

    merit.push({
        id: meritBuf.readUInt16LE(i + 0x00),
        category: meritBuf.readUInt8(i + 0x02),
        index: meritBuf.readUInt8(i + 0x03),
        maxMerits: meritBuf.readUInt8(i + 0x04),
        _05: meritBuf.readUInt8(i + 0x05),
        _06: meritBuf.readUInt8(i + 0x06),
        _07: meritBuf.readUInt8(i + 0x07),
        jobs: jobBitsToArray(meritBuf.readUInt32LE(i + 0x08))
    });
}

writeFileSync(process.argv[3], JSON.stringify(merit, null, 4));
