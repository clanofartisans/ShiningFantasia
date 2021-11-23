import fs from 'fs';
import path from 'path';

import { lsb16 } from './bytes';

interface FileTableEntry {
    ROM: number,
    Index: number,
}

class FileTable {
    basePath: string;
    table: FileTableEntry[];

    constructor (basePath: string, vt: Buffer, ft: Buffer) {
        this.basePath = basePath;
        this.table = [];

        for (let i = 0; i < vt.length; i++) {
            this.table.push({
                ROM: vt[i],
                Index: lsb16(ft, i * 2),
            });
        }
    }

    merge(vt: Buffer, ft: Buffer) {
        for (let i = 0; i < vt.length; i++) {
            if (vt[i] != 0) {
                this.table[i] = {
                    ROM: vt[i],
                    Index: lsb16(ft, i * 2),
                };
            }
        }
    }

    get length() {
        return this.table.length;
    }

    exists(fileId: number): boolean {
        if (this.table.length > fileId) {
            const {ROM, Index} = this.table[fileId];
            if (ROM != 0) {
                return true;
            }
        }
        return false;
    }

    getUniqueId(fileId: number): number {
        if (this.table.length > fileId) {
            const {ROM, Index} = this.table[fileId];
            if (ROM != 0) {
                return (ROM << 16) | Index;
            }
        }

        return 0;
    }

    getBaseFileName(fileId: number): string | null {
        if (this.table.length > fileId) {
            const {ROM, Index} = this.table[fileId];
            if (ROM != 0) {
                return ROM === 1 ? `ROM/${Index >> 7}/${Index & 0x7f}.DAT` : `ROM${ROM}/${Index >> 7}/${Index & 0x7f}.DAT`;
            }
        }
        return null;
    }

    getFileName(fileId: number): string | null {
        const baseFileName = this.getBaseFileName(fileId);
        if (baseFileName) {
            return path.join(this.basePath, baseFileName);
        }
        return null;
    }
}

export class DatReader {
    fileTable: FileTable;

    constructor(basePath: string) {
        let vt = null;
        let ft = null;
        try {
            vt = fs.readFileSync(path.join(basePath, 'VTABLE.DAT'), {
                flag: 'r',
            });
        } catch (e) {
            console.error(e);
            throw new Error('failed to open VTABLE.DAT');
        }
        try {
            ft = fs.readFileSync(path.join(basePath, 'FTABLE.DAT'), {
                flag: 'r',
            });
        } catch (e) {
            console.error(e);
            throw new Error('failed to open FTABLE.DAT');
        }

        this.fileTable = new FileTable(basePath, vt, ft);

        for (let romIndex = 2; romIndex < 10; romIndex++) {
            try {
                vt = fs.readFileSync(path.join(basePath, `ROM${romIndex}/VTABLE${romIndex}.DAT`), {
                    flag: 'r',
                });
                ft = fs.readFileSync(path.join(basePath, `ROM${romIndex}/FTABLE${romIndex}.DAT`), {
                    flag: 'r',
                });
                this.fileTable.merge(vt, ft);
            } catch (e) {
                console.error(e);
                // continue on
            }
        }

    }

    exists(fileId: number) : boolean {
        return this.fileTable.exists(fileId);
    }

    getUniqueId(fileId: number) : number {
        return this.fileTable.getUniqueId(fileId);
    }

    getBaseFileName(fileId: number) : string | null {
        return this.fileTable.getBaseFileName(fileId);
    }

    getFileName(fileId: number) : string | null {
        return this.fileTable.getFileName(fileId);
    }

    readFile(fileId: number) : Buffer {
        const fileName = this.getFileName(fileId);

        if (!fileName) {
            throw new Error(`failed to find FileId ${fileId}`);
        }

        try {
            const buf = fs.readFileSync(fileName, {
                flag: 'r',
            });

            return buf;
        } catch(e) {
            console.error(e);
            throw new Error(`failed to load FileId ${fileId}`);
        }
    }
}
