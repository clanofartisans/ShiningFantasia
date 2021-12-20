import { ResourceEntry, ResourceType } from './database';
import {
    Resource,
    Dmsg,
    EntityList,
    EventMessage,
    ItemDatabase,
    XiString
} from './resources';

export function dumpBin(b: Buffer) {
    let addr = 0;

    while (addr < b.length) {
        const bytes = [];
        const chars = [];

        const remaining = b.length - addr;
        for (let i = 0; i < 16; i++) {
            if (i >= remaining) {
                bytes[i] = '  ';
                chars[i] = ' ';
            } else {
                const c = b[addr+i];

                bytes[i] = c.toString(16).toUpperCase().padStart(2, '0');

                if (c >= 0x20 && c <= 0x7e) {
                    chars[i] = String.fromCharCode(c);
                } else {
                    chars[i] = '.';
                }
            }
        }

        const addrStr = addr.toString(16).toUpperCase().padStart(8, '0');
        console.log(`${addrStr}  ${bytes[0]} ${bytes[1]} ${bytes[2]} ${bytes[3]}  ${bytes[4]} ${bytes[5]} ${bytes[6]} ${bytes[7]}  ${bytes[8]} ${bytes[9]} ${bytes[10]} ${bytes[11]}  ${bytes[12]} ${bytes[13]} ${bytes[14]} ${bytes[15]}  ${chars[0]}${chars[1]}${chars[2]}${chars[3]}${chars[4]}${chars[5]}${chars[6]}${chars[7]}${chars[8]}${chars[9]}${chars[10]}${chars[11]}${chars[12]}${chars[13]}${chars[14]}${chars[15]}`);

        addr += 16;
    }
}

export function dumpBinToStr(b: Buffer): string {
    let s = '';
    let addr = 0;

    while (addr < b.length) {
        const bytes = [];
        const chars = [];

        const remaining = b.length - addr;
        for (let i = 0; i < 16; i++) {
            if (i >= remaining) {
                bytes[i] = '  ';
                chars[i] = ' ';
            } else {
                const c = b[addr+i];

                bytes[i] = c.toString(16).toUpperCase().padStart(2, '0');

                if (c >= 0x20 && c <= 0x7e) {
                    chars[i] = String.fromCharCode(c);
                } else {
                    chars[i] = '.';
                }
            }
        }

        const addrStr = addr.toString(16).toUpperCase().padStart(8, '0');
        s += `${addrStr}  ${bytes[0]} ${bytes[1]} ${bytes[2]} ${bytes[3]}  ${bytes[4]} ${bytes[5]} ${bytes[6]} ${bytes[7]}  ${bytes[8]} ${bytes[9]} ${bytes[10]} ${bytes[11]}  ${bytes[12]} ${bytes[13]} ${bytes[14]} ${bytes[15]}  ${chars[0]}${chars[1]}${chars[2]}${chars[3]}${chars[4]}${chars[5]}${chars[6]}${chars[7]}${chars[8]}${chars[9]}${chars[10]}${chars[11]}${chars[12]}${chars[13]}${chars[14]}${chars[15]}\n`;

        addr += 16;
    }

    return s;
}

export async function readFile(fileId: number): Promise<Buffer> {
    return window.ipcApi.readResource(fileId);
}

export async function getUniqueId(fileId: number): Promise<number> {
    return window.ipcApi.getUniqueId(fileId);
}

export async function getFileName(fileId: number): Promise<GetFileNameResult | null> {
    return window.ipcApi.getFileName(fileId);
}

export async function loadDmsg(fileId: number): Promise<Dmsg> {
    const buf = Buffer.from(await readFile(fileId));

    try {
        return new Dmsg(buf);
    } catch (e) {
        console.error(`${fileId}: Exception ${e}`);

        // print out the first 256 bytes
        dumpBin(buf.slice(0, 256));

        throw e;
    }
}

export async function loadEventMessage(fileId: number): Promise<EventMessage> {
    const buf = Buffer.from(await readFile(fileId));

    try {
        return new EventMessage(buf);
    } catch (e) {
        console.error(`${fileId}: Exception ${e}`);

        // print out the first 256 bytes
        dumpBin(buf.slice(0, 256));

        throw e;
    }
}

function getConstructor(entry: ResourceEntry) {
    switch (entry.type) {
        case ResourceType.Dmsg:
        default:
            return Dmsg;
        case ResourceType.EntityList:
            return EntityList;
        case ResourceType.EventMessage:
            return EventMessage;
        case ResourceType.Item:
            return ItemDatabase;
        case ResourceType.XiString:
            return XiString;
    }
}

export async function loadResource(entry: ResourceEntry): Promise<Resource> {
    const constructor = getConstructor(entry);

    const fileId = entry.fileId as number;

    const fileName = await getFileName(fileId);
    entry.fileName = {
        baseName: fileName!.baseFileName,
        fileName: fileName!.fileName,
    };

    const buf = Buffer.from(await readFile(fileId));

    try {
        return new constructor(buf);
    } catch (e) {
        console.error(`${fileId}: Exception ${e}`);

        // print out the first 256 bytes
        dumpBin(buf.slice(0, 256));

        throw e;
    }
}
