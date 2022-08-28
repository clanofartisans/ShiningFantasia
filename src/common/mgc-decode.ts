import { lsb8 } from './bytes';

// Decoder/encoder for magic, ability, and icon? resources.

function rol(b: number, r: number): number {
    return ((b << r) | (b >>> (8 - r))) & 0xFF;
}

function ror(b: number, r: number): number {
    return ((b >>> r) | (b << (8 - r))) & 0xFF;
}

function popCount32(v: number): number {
    // https://graphics.stanford.edu/~seander/bithacks.html#CountBitsSetParallel
    v = v - ((v >>> 1) & 0x55555555);
    v = (v & 0x33333333) + ((v >>> 2) & 0x33333333);
    return ((v + (v >>> 4) & 0xF0F0F0F) * 0x1010101) >> 24;
}

const rotateAmounts: Array<number> = [
    1,
    7,
    2,
    6,
    3,
];

function getRotateAmount(x: number, y: number, z: number): number {
    const xBits = popCount32(x);
    const yBits = popCount32(y);
    const zBits = popCount32(z);

    const type = Math.abs(xBits + zBits - yBits) % 5;

    return rotateAmounts[type];
}

export function decode(b: Buffer, blockLength: number) {
    if ((b.length % blockLength) !== 0) {
        return b;
    }

    for (let i = 0; i < b.length; i += blockLength) {
        const x = lsb8(b, i + 2);
        const y = lsb8(b, i + 11);
        const z = lsb8(b, i + 12);

        const rot = getRotateAmount(x, y, z);

        for (let j = 0; j < blockLength; j++) {
            if (((j != 2) && (j != 0xb)) && (j != 0xc)) {
                b[i + j] = rol(b[i + j], rot);
            }
        }
    }

   return b;
}

export function encode(b: Buffer, blockLength: number) {
    if ((b.length % blockLength) !== 0) {
        return b;
    }

    for (let i = 0; i < b.length; i += blockLength) {
        const x = lsb8(b, i + 2);
        const y = lsb8(b, i + 11);
        const z = lsb8(b, i + 12);

        const rot = getRotateAmount(x, y, z);

        for (let j = 0; j < blockLength; j++) {
            if (((j != 2) && (j != 0xb)) && (j != 0xc)) {
                b[i + j] = ror(b[i + j], rot);
            }
        }
    }

   return b;
}
