import { lsb16, lsb32 } from '../bytes';
import { decodeString, encodeString } from '../string';
import { Resource } from './resource';

export type Elem = number | string;
export type Entry = Elem[];

export interface DmsgJsonEntry {
    _id: number;
    text: Entry;
}

export interface DmsgJsonEntryWithHeader extends DmsgJsonEntry {
    encoding?: number;
    fixedLength?: number;
}

export interface DmsgJsonLocalizedEntry {
    _id: number;
    englishText: Entry | null;
    japaneseText: Entry | null;
}

export interface DmsgJsonLocalizedEntryWithHeader extends DmsgJsonLocalizedEntry {
    encoding?: number;
    fixedLength?: number;
}

export type DmsgJson = [DmsgJsonEntryWithHeader, ...Array<DmsgJsonEntry>] | [DmsgJsonLocalizedEntryWithHeader, ...Array<DmsgJsonLocalizedEntry>];

export type DmsgEntryKey = "text" | "englishText" | "japaneseText";

const unusedHeader = Buffer.from([
    0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00
]);

export function decodeDmsgEntry(b: Buffer): Entry {

    const numStrings = lsb32(b, 0);
    let offset = 4;

    const elems: Entry = [];

    let unusedActive = false;

    for (let j = 0; j < numStrings; j++) {
        let stringOffset = lsb32(b, offset);
        const stringType = lsb32(b, offset + 4);
        offset += 8;

        if (stringType === 0) {
            if (b.compare(unusedHeader, 0, unusedHeader.length, stringOffset, stringOffset + 0x1C)) {
                unusedActive = true;
            }

            if (unusedActive) {
                const headerDebug = {
                    // always 1
                    type: lsb16(b, stringOffset + 0x00),

                    // always 0
                    _0x02: lsb16(b, stringOffset + 0x02),
                    _0x04: lsb16(b, stringOffset + 0x04),
                    _0x06: lsb16(b, stringOffset + 0x06),
                    _0x08: lsb16(b, stringOffset + 0x08),
                    _0x0A: lsb16(b, stringOffset + 0x0A),
                    _0x0C: lsb16(b, stringOffset + 0x0C),
                    _0x0E: lsb16(b, stringOffset + 0x0E),
                    _0x10: lsb16(b, stringOffset + 0x10),
                    _0x12: lsb16(b, stringOffset + 0x12),
                    _0x14: lsb16(b, stringOffset + 0x14),
                    _0x16: lsb16(b, stringOffset + 0x16),
                    _0x18: lsb16(b, stringOffset + 0x18),
                    _0x1A: lsb16(b, stringOffset + 0x1A),
                };
                console.log(`Entry${j}: ${JSON.stringify(headerDebug, null, 4)}`);
            }

            stringOffset += 0x1C;

            let stringLength = 0;

            // Calculate string length.
            while (b[stringOffset + stringLength] !== 0) {
                stringLength++;
            }

            const strBuf = b.subarray(stringOffset, stringOffset + stringLength);
            const s = decodeString(strBuf);
            elems.push(s);
        } else {
            const v = lsb32(b, stringOffset);
            elems.push(v);
        }
    }

    return elems;
}

export function encodeDmsgEntry(b: Buffer, elems: Entry, isEnglish?: boolean): number {
    const encoded: Buffer[] = [];

    for (let i = 0; i < elems.length; i++) {
        if (typeof elems[i] === 'string') {
            const buf = encodeString(elems[i] as string, isEnglish);
            encoded.push(buf);
        } else {
            const buf = Buffer.alloc(4);
            buf.writeUInt32LE(elems[i] as number);
            encoded.push(buf);
        }
    }

    let offset = 4;
    let dataOffset = 4 + elems.length * 8;

    b.writeInt32LE(elems.length, 0);

    for (let i = 0; i < elems.length; i++) {
        b.writeInt32LE(dataOffset, offset + 0);

        if (typeof elems[i] === 'string') {
            b.writeInt32LE(0, offset + 4);

            b.set(unusedHeader, dataOffset);
            dataOffset += unusedHeader.length;
        } else {
            b.writeInt32LE(1, offset + 4);
        }

        offset += 8;

        b.set(encoded[i], dataOffset);
        dataOffset += encoded[i].length;
    }

    return dataOffset;
}

export class Dmsg extends Resource {
    // header magic is 64 5F 6D 73 67 00 00 00 (d_msg)
    static readonly magic = new Uint8Array([0x64, 0x5f, 0x6d, 0x73, 0x67, 0x00, 0x00, 0x00]);

    entries: Entry[];

    encoding: number;
    fixedLength: number;

    constructor(b: Buffer) {
        super();

        this.entries = [];

        if (b.length < Dmsg.magic.length) {
            throw new Error('buffer too small');
        }

        if (b.compare(Dmsg.magic, 0, Dmsg.magic.length, 0, Dmsg.magic.length) !== 0) {
            throw new Error('not a Dmsg');
        }

        if (b.length < 64) {
            throw new Error('Dmsg truncated');
        }

        this.encoding = lsb16(b, 0x0a);
        this.fixedLength = lsb32(b, 0x20);

        const isByteSwapped = lsb16(b, 0x08) !== 1; /// 0x01 - LSB, 0x10 - XISTRING-esque?, everything else - byte swap
        const isInverted = lsb16(b, 0x0a) === 1;
        // 0xc - 3 (required)
        // 0xe - 0 (required)
        // 0x10 - 3
        const fileLength = lsb32(b, 0x14);
        const headerSize = lsb32(b, 0x18);
        const dataOffset = lsb32(b, 0x1c);
        const fixedLength = lsb32(b, 0x20);
        const dataSize = lsb32(b, 0x24);
        const numEntries = lsb32(b, 0x28);
        // 0x2c - 1
        // 0x30 - 0
        // 0x34 - 0
        // 0x38 - 0
        // 0x3c - 0

        // if fixedLength > 0:
        //    fileLength = headerSize + dataSize
        // else:
        //    fileLength = headerSize + numEntries * 8 + dataSize
        if (false) {
            const headerDebug = {
                type: lsb16(b, 0x08),
                encoding: lsb16(b, 0x0A),
                _0x0C: lsb16(b, 0x0C),
                _0x0E: lsb16(b, 0x0E),
                _0x10: lsb32(b, 0x10),
                fileLength: lsb32(b, 0x14),
                headerSize: lsb32(b, 0x18),
                dataOffset: lsb32(b, 0x1C),
                fixedLength: lsb32(b, 0x20),
                dataSize: lsb32(b, 0x24),
                numEntries: lsb32(b, 0x28),
                _0x2C: lsb32(b, 0x2C),
                _0x30: lsb32(b, 0x30),
                _0x34: lsb32(b, 0x34),
                _0x38: lsb32(b, 0x38),
                _0x3C: lsb32(b, 0x3C),
            };
            console.log(`Header: ${JSON.stringify(headerDebug, null, 4)}`);
        }

        if (fileLength !== b.length) {
            throw new Error('Dmsg length is wrong');
        }

        let addrOffset = headerSize;

        if (isInverted) {
            for (let i = addrOffset; i < b.length; i++) {
                b[i] = b[i] ^ 0xff;
            }
        }

        for (let i = 0; i < numEntries; i++) {
            let offset;
            let length;

            if (fixedLength) {
                offset = addrOffset;
                length = fixedLength;
                addrOffset += fixedLength;
            } else {
                offset = lsb32(b, addrOffset) + dataOffset + headerSize;
                length = lsb32(b, addrOffset + 4);
                addrOffset += 8;
            }

            const elems = decodeDmsgEntry(b.subarray(offset, offset + length));

            this.entries.push(elems);
        }
    }

    get length(): number {
        return this.entries.length;
    }

    getEntry(stringId: number): Entry | null {
        if (stringId < this.entries.length) {
            return this.entries[stringId];
        }

        return null;
    }

    private static exportLanguage(dmsgJson: DmsgJson, langKey: DmsgEntryKey): Buffer {
        const headerSize = 64;

        let dataOffset = 0;

        const header = Buffer.alloc(headerSize).fill(Dmsg.magic);

        header.writeUInt16LE(0x01, 0x08);
        header.writeUInt16LE(0x00, 0x0A);
        header.writeUInt16LE(0x03, 0x0C);
        header.writeUInt16LE(0x00, 0x0E);
        header.writeUInt32LE(0x03, 0x10);
        header.writeUInt32LE(headerSize, 0x14);
        header.writeUInt32LE(headerSize, 0x18);
        header.writeUInt32LE(dataOffset, 0x1C);
        header.writeUInt32LE(0x00, 0x20);
        header.writeUInt32LE(0x00, 0x24);
        header.writeUInt32LE(0x00, 0x28);
        header.writeUInt32LE(0x01, 0x2C);
        header.writeUInt32LE(0x00, 0x30);
        header.writeUInt32LE(0x00, 0x34);
        header.writeUInt32LE(0x00, 0x38);
        header.writeUInt32LE(0x00, 0x3C);

        const chunks: Buffer[] = [header];

        let numEntries = dmsgJson.length;
        for (let i = 0; i < numEntries; i++) {
            if ((dmsgJson[i] as any)[langKey] === null) {
                // truncate the list here
                numEntries = i;
                break;
            }
        }

        if (numEntries > 0) {
            const headerEntry = dmsgJson[0];

            const encoding = headerEntry?.encoding ?? 0;
            const fixedLength = headerEntry?.fixedLength ?? 0;

            // if fixedLength > 0:
            //    fileLength = headerSize + dataSize
            // else:
            //    fileLength = headerSize + numEntries * 8 + dataSize

            const entryTableLength = ((fixedLength === 0) ? (numEntries * 8) : 0);
            dataOffset = entryTableLength;

            const entryTable = Buffer.alloc(entryTableLength);
            chunks.push(entryTable);

            // const isByteSwapped = lsb16(b, 0x08) !== 1; /// 0x01 - LSB, 0x10 - XISTRING-esque?, everything else - byte swap
            // done at start
            // const isInverted = lsb16(b, 0x0a) === 1;
            header.writeUInt16LE(encoding, 0x0A);
            // 0xc - 3 (required)
            // done at start
            // 0xe - 0 (required)
            // done at start
            // 0x10 - 3
            // done at start
            // const fileLength = lsb32(b, 0x14);
            // calculated at end
            // const headerSize = lsb32(b, 0x18);
            // done at start
            // const dataOffset = lsb32(b, 0x1c);
            header.writeUInt32LE(dataOffset, 0x1C);
            // const fixedLength = lsb32(b, 0x20);
            header.writeUInt32LE(fixedLength, 0x20);
            // const dataSize = lsb32(b, 0x24);
            // calculated at end
            // const numEntries = lsb32(b, 0x28);
            header.writeUInt32LE(numEntries, 0x28);
            // 0x2c - 1
            // 0x30 - 0
            // 0x34 - 0
            // 0x38 - 0
            // 0x3c - 0

            const entryTmpBuf: Buffer = Buffer.alloc(65536);

            let entryOffset = 0;

            for (let i = 0; i < numEntries; i++) {
                const dmsgEntry: Entry = (dmsgJson[i] as any)[langKey] as Entry;

                entryTmpBuf.fill(0x00);

                let entryRawSize = encodeDmsgEntry(entryTmpBuf, dmsgEntry, langKey !== 'japaneseText');

                if (fixedLength > 0 && entryRawSize > fixedLength) {
                    console.error(`Entry ${i} is truncated from ${entryRawSize} to ${fixedLength} bytes!`);
                }

                if (fixedLength > 0) {
                    entryRawSize = fixedLength;
                }

                const entryBuf = Buffer.from(entryTmpBuf.subarray(0, entryRawSize));

                chunks.push(entryBuf);

                if (fixedLength === 0) {
                    entryTable.writeUInt32LE(entryOffset, i * 8);
                    entryTable.writeUInt32LE(entryRawSize, i * 8 + 4);
                }

                entryOffset += entryRawSize;
            }

            if (encoding) {
                for (let i = 1; i < chunks.length; i++) {
                    const b: Buffer = chunks[i];

                    for (let j = 0; j < b.length; j++) {
                        b[j] ^= 0xFF;
                    }
                }
            }
        }

        const out = Buffer.concat(chunks);

        const fileLength = out.length;
        const dataSize = fileLength - dataOffset - headerSize;
        out.writeUInt32LE(fileLength, 0x14);
        out.writeUInt32LE(dataSize, 0x24);

        return out;
    }

    public static export(dmsgJson: DmsgJson): [Buffer, Buffer | null] {
        let eBuffer = null;
        let jBuffer = null;

        if (dmsgJson.length > 0) {
            const headerEntry = dmsgJson[0];
            if ('englishText' in headerEntry) {
                eBuffer = Dmsg.exportLanguage(dmsgJson, 'englishText');
            } else {
                eBuffer = Dmsg.exportLanguage(dmsgJson, 'text');
            }

            if ('japaneseText' in headerEntry) {
                jBuffer = Dmsg.exportLanguage(dmsgJson, 'japaneseText');
            }
        } else {
            eBuffer = Dmsg.exportLanguage(dmsgJson, 'text');
        }

        return [eBuffer!, jBuffer];
    }
}
