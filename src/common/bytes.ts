export function lsb8(b: Buffer, offset: number): number {
    return b.readUInt8(offset);
}

export function lsb16(b: Buffer, offset: number): number {
    return b.readUInt16LE(offset);
}

export function lsb24(b: Buffer, offset: number): number {
    return (b[offset+2] << 16) | (b[offset+1] << 8) | b[offset];
}

export function lsb32(b: Buffer, offset: number): number {
    return b.readUInt32LE(offset);
}

export function lsbf32(b: Buffer, offset: number): number {
    return b.readFloatLE(offset);
}
