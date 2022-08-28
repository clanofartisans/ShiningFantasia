import { ResourceEntry, ResourceType } from './database';
import {
    Resource,
    ChunkedResource,
    Dmsg,
    EntityList,
    EventMessage,
    ItemDatabase,
    XiString
} from './resources';

import { dumpBin } from './util';
export { dumpBinToStr } from './util';

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
        dumpBin(buf.subarray(0, 256));

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
        dumpBin(buf.subarray(0, 256));

        throw e;
    }
}

function getConstructor(entry: ResourceEntry) {
    switch (entry.type) {
        case ResourceType.Dmsg:
        default:
            return Dmsg;
        case ResourceType.ChunkedResource:
            return ChunkedResource;
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
        dumpBin(buf.subarray(0, 256));

        throw e;
    }
}
