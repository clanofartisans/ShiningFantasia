import { lsb32 } from '../bytes';
import { Resource } from './resource';
import { decodeString } from '../string';

export enum ChunkedResourceType {
    Terminate = 0,
    Rmp = 1,
    Rmw = 2,
    Directory = 3,
    Bin = 4,
    Generator = 5,
    Camera = 6,
    Scheduler = 7,
    Mtx = 8,
    Tim = 9,
    TexInfo = 10,
    Vum = 11,
    Oml = 12,
    FileInfo = 13,
    Anm = 14,
    Rsd = 15,
    UnKnown = 16,
    Osm = 17,
    Skd = 18,
    Mtd = 19,
    Mld = 20,
    Mlt = 21,
    Mws = 22,
    Mod = 23,
    Tim2 = 24,
    KeyFrame = 25,
    Bmp = 26,
    Bmp2 = 27,
    Mzb = 28,
    Mmd = 29,
    Mep = 30,
    D3m = 31,
    D3s = 32,
    D3a = 33,
    DistProg = 34,
    VuLineProg = 35,
    RingProg = 36,
    D3b = 37,
    Asn = 38,
    Mot = 39,
    Skl = 40,
    Sk2 = 41,
    Os2 = 42,
    Mo2 = 43,
    Ps2 = 44,
    Wsd = 45,
    Mmb = 46,
    Weather = 47,
    Meb = 48,
    Msb = 49,
    Med = 50,
    Msh = 51,
    Ysh = 52,
    Mpb = 53,
    Rid = 54,
    Wd = 55,
    Bgm = 56,
    Lfd = 57,
    Lfe = 58,
    Esh = 59,
    Sch = 60,
    Sep = 61,
    Vtx = 62,
    Lwo = 63,
    Rme = 64,
    Elt = 65,
    Rab = 66,
    Mtt = 67,
    Mtb = 68,
    Cib = 69,
    Tlt = 70,
    PointLightProg = 71,
    Mgd = 72,
    Mgb = 73,
    Sph = 74,
    Bmd = 75,
    Qif = 76,
    Qdt = 77,
    Mif = 78,
    Mdt = 79,
    Sif = 80,
    Sdt = 81,
    Acd = 82,
    Acb = 83,
    Afb = 84,
    Aft = 85,
    Wwd = 86,
    NullProg = 87,
    Spw = 88,
    Fud = 89,
    DisgregaterProg = 90,
    Smt = 91,
    DamValueProg = 92,
    Bp = 93,
    Unknown1 = 94,
    Unknown2 = 95,
    Max = 96,
};

export const ChunkedResourceTypeNames = [
    "Terminate",
    "Rmp",
    "Rmw",
    "Directory",
    "Bin",
    "Generator",
    "Camera",
    "Scheduler",
    "Mtx",
    "Tim",
    "TexInfo",
    "Vum",
    "Oml",
    "FileInfo",
    "Anm",
    "Rsd",
    "UnKnown",
    "Osm",
    "Skd",
    "Mtd",
    "Mld",
    "Mlt",
    "Mws",
    "Mod",
    "Tim2",
    "KeyFrame",
    "Bmp",
    "Bmp2",
    "Mzb",
    "Mmd",
    "Mep",
    "D3m",
    "D3s",
    "D3a",
    "DistProg",
    "VuLineProg",
    "RingProg",
    "D3b",
    "Asn",
    "Mot",
    "Skl",
    "Sk2",
    "Os2",
    "Mo2",
    "Ps2",
    "Wsd",
    "Mmb",
    "Weather",
    "Meb",
    "Msb",
    "Med",
    "Msh",
    "Ysh",
    "Mpb",
    "Rid",
    "Wd",
    "Bgm",
    "Lfd",
    "Lfe",
    "Esh",
    "Sch",
    "Sep",
    "Vtx",
    "Lwo",
    "Rme",
    "Elt",
    "Rab",
    "Mtt",
    "Mtb",
    "Cib",
    "Tlt",
    "PointLightProg",
    "Mgd",
    "Mgb",
    "Sph",
    "Bmd",
    "Qif",
    "Qdt",
    "Mif",
    "Mdt",
    "Sif",
    "Sdt",
    "Acd",
    "Acb",
    "Afb",
    "Aft",
    "Wwd",
    "NullProg",
    "Spw",
    "Fud",
    "DisgregaterProg",
    "Smt",
    "DamValueProg",
    "Bp",
    "Unknown1", // "Max",
    "Unknown2",
    "Max",
];

type Constructor<T = {}> = new (...args: any[]) => T;
type ResourceConstructorEntry = Constructor<Resource> | null;
const resourceConstructors: ResourceConstructorEntry[] = [
    null, // "Terminate",
    null, // "Rmp",
    null, // "Rmw",
    null, // "Directory",
    null, // "Bin",
    null, // "Generator",
    null, // "Camera",
    null, // "Scheduler",
    null, // "Mtx",
    null, // "Tim",
    null, // "TexInfo",
    null, // "Vum",
    null, // "Oml",
    null, // "FileInfo",
    null, // "Anm",
    null, // "Rsd",
    null, // "UnKnown",
    null, // "Osm",
    null, // "Skd",
    null, // "Mtd",
    null, // "Mld",
    null, // "Mlt",
    null, // "Mws",
    null, // "Mod",
    null, // "Tim2",
    null, // "KeyFrame",
    null, // "Bmp",
    null, // "Bmp2",
    null, // "Mzb",
    null, // "Mmd",
    null, // "Mep",
    null, // "D3m",
    null, // "D3s",
    null, // "D3a",
    null, // "DistProg",
    null, // "VuLineProg",
    null, // "RingProg",
    null, // "D3b",
    null, // "Asn",
    null, // "Mot",
    null, // "Skl",
    null, // "Sk2",
    null, // "Os2",
    null, // "Mo2",
    null, // "Ps2",
    null, // "Wsd",
    null, // "Mmb",
    null, // "Weather",
    null, // "Meb",
    null, // "Msb",
    null, // "Med",
    null, // "Msh",
    null, // "Ysh",
    null, // "Mpb",
    null, // "Rid",
    null, // "Wd",
    null, // "Bgm",
    null, // "Lfd",
    null, // "Lfe",
    null, // "Esh",
    null, // "Sch",
    null, // "Sep",
    null, // "Vtx",
    null, // "Lwo",
    null, // "Rme",
    null, // "Elt",
    null, // "Rab",
    null, // "Mtt",
    null, // "Mtb",
    null, // "Cib",
    null, // "Tlt",
    null, // "PointLightProg",
    null, // "Mgd",
    null, // "Mgb",
    null, // "Sph",
    null, // "Bmd",
    null, // "Qif",
    null, // "Qdt",
    null, // "Mif",
    null, // "Mdt",
    null, // "Sif",
    null, // "Sdt",
    null, // "Acd",
    null, // "Acb",
    null, // "Afb",
    null, // "Aft",
    null, // "Wwd",
    null, // "NullProg",
    null, // "Spw",
    null, // "Fud",
    null, // "DisgregaterProg",
    null, // "Smt",
    null, // "DamValueProg",
    null, // "Bp",
    null, // "Unknown1" -- may be a resource of an unknown sort, not a sentinel ("Max")
    null, // "Unknown2" -- also may be a resource of an unknown sort
];

export interface Entry {
    type: number;
    name: string;
    length: number,
    resource: Resource | null;
}

export class ChunkedResource {
    resources: Entry[];

    constructor(b: Buffer) {
        this.resources = [];

        let offset = 0;

        while (offset <= b.length - 16) {
            const name = decodeString(b.slice(offset, offset + 4));

            const header0 = lsb32(b, offset + 4);
            const header1 = lsb32(b, offset + 8);
            const header2 = lsb32(b, offset + 12);

            const type = header0 & 0x7f;
            const length = (((header0 & 0xfffffff) >> 7) << 4) - 16;
            const unknown = (header0 >> 28);

            if (b.length - offset < length + 16) {
                throw new Error('Corrupt Resource DAT');
            }

            if (type >= resourceConstructors.length) {
                throw new Error('Unsupported Resource');
            }

            offset += 16;
            const resBuf = b.slice(offset, offset + length);
            offset += length;

            const constructor = resourceConstructors[type];

            if (constructor == null) {
                this.resources.push({
                    type,
                    name,
                    length,
                    resource: null,
                });
            } else {
                const resource = new constructor({
                    type,
                    length,
                }, resBuf, length);

                this.resources.push({
                    type,
                    name,
                    length,
                    resource,
                });
            }
        }
    }

    static getTypeName(type: number) {
        if (type >= 0 && type < ChunkedResourceType.Max) {
            return ChunkedResourceTypeNames[type];
        }

        return '<Unknown>';
    }
}
