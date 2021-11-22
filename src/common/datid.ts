export abstract class EnglishConstants {
    static readonly zoneNames: number = 0xd8a9;
}

export abstract class JapaneseConstants {
    static readonly zoneNames: number = 0xd8ef;
}

export abstract class ZoneConstants {
    static readonly common: number = 0x1b8c;
}

export function getZoneFileId(zoneId: number) {
    return (zoneId < 600) ? zoneId + 100 : zoneId + 0x144f7;
}

export function getZoneBumpMapFileId(zoneId: number) {
    return (zoneId < 600) ? zoneId + 0x9b97 : zoneId + 0x14817;
}
