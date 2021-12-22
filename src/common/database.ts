export enum ResourceType {
    ChunkedResource,
    Dmsg,
    EntityList,
    EventMessage,
    Item,
    XiString,
}

export interface ResourceLanguage {
    J?: number,
    E?: number,
    D?: number,
    F?: number,
}

export interface ResourceFileName {
    baseName: string,
    fileName: string,
}

export interface ResourceEntry {
    fileId: number | ResourceLanguage;
    type?: ResourceType;
    description: string;
    fileName?: ResourceFileName | null,
}

export const database: ResourceEntry[] = [];

const commonResources: ResourceEntry[] = [

    // Common resources
    {
        fileId: 0xd8b2,
        type: ResourceType.Dmsg,
        description: 'Chocobo Names',
    },

    // Weather files
    // { fileId: 0x1B78, description: '<Unknown>' }, // Base for weather regions 0-99
    // { fileId: 0x1B79, description: '<Unknown>' }, // Region table for regions 0-99
    // { fileId: 0x1B7C, description: '<Unknown>' }, // Base for weather regions 100+
    // { fileId: 0x1B7D, description: '<Unknown>' }, // Region table for regions 100+

    // Need to be categorized
    { fileId: 0xd8c9, type: ResourceType.Dmsg,             description: '<Unknown>' }, // - / -
    { fileId: 0xd8ca, type: ResourceType.Dmsg,             description: '<Unknown>' }, // - / -
    { fileId: 0xd8a9, type: ResourceType.Dmsg,             description: 'Zone Names' }, // - / 5
    { fileId: 0xd8aa, type: ResourceType.Dmsg,             description: 'Zone Names (Short)' }, // - / 4
    { fileId: 0xd8af, type: ResourceType.Dmsg,             description: 'Slot Names' }, // - / 24
    { fileId: 0xd8b0, type: ResourceType.Dmsg,             description: 'Einherjar Chambers' }, // - / 25
    { fileId: 0xd8ac, type: ResourceType.Dmsg,             description: 'Job Names (Short)' }, // - / 2

    // Localized resources
    { fileId: 0x9A76,  type: ResourceType.ChunkedResource, description: 'Resource - <Unknown>' }, // 0
    { fileId: 0x9A75,  type: ResourceType.ChunkedResource, description: 'Resource - <Unknown>' }, // 1
    { fileId: 0xD8AD,  type: ResourceType.Dmsg,         description: '<Unknown>' }, // 2 / 6
    { fileId: 0xD8AE,  type: ResourceType.Dmsg,         description: '<Unknown>' }, // 3 / 1
    { fileId: 0xD8AB,  type: ResourceType.Dmsg,         description: 'Job Names' }, // 4 / 3
    { fileId: 0x3F,    type: ResourceType.XiString,     description: '<Unknown>' }, // 5 / 0
    { fileId: 0xD95D,  type: ResourceType.Dmsg,         description: '<Unknown>' }, // 6 / 27
    { fileId: 0xD95E,  type: ResourceType.Dmsg,         description: '<Unknown>' }, // 7 / 7
    { fileId: 0x30,    type: ResourceType.XiString,     description: '<Unknown>' }, // 8 / 8
    { fileId: 0xD960,  type: ResourceType.Dmsg,         description: '<Unknown>' }, // 9 / 9
    { fileId: 0x32,    type: ResourceType.XiString,     description: '<Unknown>' }, // 10 / 10
    { fileId: 0xD962,  type: ResourceType.Dmsg,         description: '<Unknown>' }, // 11 / 11
    { fileId: 0xD963,  type: ResourceType.Dmsg,         description: '<Unknown>' }, // 12 / 14
    { fileId: 0xD964,  type: ResourceType.Dmsg,         description: '<Unknown>' }, // 13 / 13
    { fileId: 0xD965,  type: ResourceType.Dmsg,         description: '<Unknown>' }, // 14 / 12
    { fileId: 0xD966,  type: ResourceType.Dmsg,         description: '<Unknown>' }, // 15 / 19
    { fileId: 0xD8A9,  type: ResourceType.Dmsg,         description: '<Unknown>' }, // 16 / 20
    { fileId: 0xD96D,  type: ResourceType.Dmsg,         description: '<Unknown>' }, // 17 / 21
    { fileId: 0xD980,  type: ResourceType.Dmsg,         description: 'Server Names' }, // 18 / 22
    { fileId: 0xD8AB,  type: ResourceType.Dmsg,         description: '<Unknown>' }, // 19 / 18
    { fileId: 0xD969,  type: ResourceType.Dmsg,         description: '<Unknown>' }, // 20
    { fileId: 0xD96A,  type: ResourceType.Dmsg,         description: '<Unknown>' }, // 21 / 16
    { fileId: 0xD96B,  type: ResourceType.Dmsg,         description: 'Heading Names' }, // 22 / 15
    { fileId: 0xD96C,  type: ResourceType.Dmsg,         description: 'Moon Phases' }, // 23 / 17
    { fileId: 0xD971,  type: ResourceType.Dmsg,         description: '<Unknown>' }, // 24
    { fileId: 0xD972,  type: ResourceType.Dmsg,         description: 'Equipment Slot Names' }, // 25 / 23
    { fileId: 0xD985,  type: ResourceType.Dmsg,         description: 'Blue Mage Spell Help Text' }, // 26
    { fileId: 0xD98C,  type: ResourceType.Dmsg,         description: 'Augment Attributes' }, // 27
    { fileId: 0xD988,  type: ResourceType.Dmsg,         description: '<Unknown>' }, // 28
    { fileId: 0xD986,  type: ResourceType.Dmsg,         description: 'Menu Text - Merit Points' }, // 29
    { fileId: 0xD98E,  type: ResourceType.Dmsg,         description: 'Menu Text - Job Points' }, // 30
    { fileId: 0xD97A,  type: ResourceType.Dmsg,         description: 'Menu Text - Job Point Gifts' }, // 31
    { fileId: 0xD989,  type: ResourceType.Dmsg,         description: 'Soulplate Attributes' }, // 32
    { fileId: 0xD98D,  type: ResourceType.Dmsg,         description: 'Trust Messages' }, // 33
    { fileId: 0xD97C,  type: ResourceType.Dmsg,         description: 'Emote Help Text' }, // 34
    { fileId: 0xD987,  type: ResourceType.Dmsg,         description: 'Chat Window Command Help Text' }, // 35
    { fileId: 0xD98A,  type: ResourceType.Dmsg,         description: 'Monster Family Names' }, // 36
    { fileId: 0xD98B,  type: ResourceType.Dmsg,         description: 'Moblin Maze Mongers Rune Help Text' }, // 37
    { fileId: 0x5B,    type: ResourceType.Item,         description: 'Gil - Item 65535' }, // 38
    { fileId: 0x49,    type: ResourceType.Item,         description: 'Items 0 - 4095' }, // 39
    { fileId: 0xD977,  type: ResourceType.Item,         description: 'Items 8704 - 10239' }, // 40
    { fileId: 0x4A,    type: ResourceType.Item,         description: 'Items 4096 - 8191' }, // 41
    { fileId: 0x4B,    type: ResourceType.Item,         description: 'Weapons - Items 16384 - 23039' }, // 42
    { fileId: 0xD973,  type: ResourceType.Item,         description: 'Moblin Maze Mongers - Items 28672 - 29695' }, // 43
    { fileId: 0xD976,  type: ResourceType.Item,         description: 'Monstrosity - Items 29696 - 30719' }, // 44
    { fileId: 0x5F,    type: ResourceType.Item,         description: 'Items 61432 - 61439' }, // 45
    { fileId: 0xD978,  type: ResourceType.Item,         description: 'Records of Eminence Objectives - Items 57344 - 61431' }, // 46
    { fileId: 0xD979,  type: ResourceType.Item,         description: 'Records of Eminence Categories - Items 61952 - 62975' }, // 47
    { fileId: 0xD97D,  type: ResourceType.Item,         description: 'Items 63024 - 63263' }, // 48
    { fileId: 0xD97E,  type: ResourceType.Item,         description: 'Items 63008 - 63023' }, // 49
    { fileId: 0xD8D0,  type: ResourceType.Item,         description: 'Items 62976 - 62995' }, // 50
    { fileId: 0x4C,    type: ResourceType.Item,         description: 'Armor - Items 10240 - 16383' }, // 51
    { fileId: 0xD974,  type: ResourceType.Item,         description: 'Armor - Items 23040 - 28671' }, // 52
    { fileId: 0x4D,    type: ResourceType.Item,         description: 'Puppetmaster Automaton - Items 8192 - 8703' }, // 53
    { fileId: 0x55,    type: ResourceType.Dmsg,         description: '<Unknown>' }, // 54
    { fileId: 0x56,    type: ResourceType.Dmsg,         description: '<Unknown>' }, // 55
    { fileId: 0x57,    type: ResourceType.Dmsg,         description: '<Unknown>' }, // 56
    { fileId: 0x9A85,  type: ResourceType.Dmsg,         description: '<Unknown>' }, // 57
    { fileId: 0xD975,  type: ResourceType.Item,         description: 'Monstrosity - Items 61440 - 61951' }, // 58
    { fileId: 0xD97F,  type: ResourceType.Dmsg,         description: 'The 15th Anniversary Quiz for the Ages' }, // 59 / 26
    { fileId: 0xD998,  type: ResourceType.Dmsg,         description: 'Titles' }, // 60
    { fileId: 0xD999,  type: ResourceType.Dmsg,         description: 'Key Items' }, // 61
    { fileId: 0xD99A,  type: ResourceType.Dmsg,         description: 'Quests - San d\'Oria' }, // 62
    { fileId: 0xD99B,  type: ResourceType.Dmsg,         description: 'Quests - Bastok' }, // 63
    { fileId: 0xD99C,  type: ResourceType.Dmsg,         description: 'Quests - Windurst' }, // 64
    { fileId: 0xD99D,  type: ResourceType.Dmsg,         description: 'Quests - Jeuno' }, // 65
    { fileId: 0xD99E,  type: ResourceType.Dmsg,         description: 'Quests - Other Areas' }, // 66
    { fileId: 0xD99F,  type: ResourceType.Dmsg,         description: 'Quests - Outlands' }, // 67
    { fileId: 0xD9A0,  type: ResourceType.Dmsg,         description: 'Quests - Treasures of Aht Urhgan' }, // 68
    { fileId: 0xD9AA,  type: ResourceType.Dmsg,         description: 'Quests - Wings of the Goddess' }, // 69
    { fileId: 0xD9A1,  type: ResourceType.Dmsg,         description: 'Quests - Abyssea' }, // 70
    { fileId: 0xD9A3,  type: ResourceType.Dmsg,         description: 'Missions - San d\'Oria' }, // 71
    { fileId: 0xD9A4,  type: ResourceType.Dmsg,         description: 'Missions - Bastok' }, // 72
    { fileId: 0xD9A5,  type: ResourceType.Dmsg,         description: 'Missions - Windurst' }, // 73
    { fileId: 0xD9A6,  type: ResourceType.Dmsg,         description: 'Missions - Rise of the Zilart' }, // 74
    { fileId: 0xD9A7,  type: ResourceType.Dmsg,         description: 'Missions - Chains of Promathia' }, // 75
    { fileId: 0xD9A8,  type: ResourceType.Dmsg,         description: 'Quests - Assult' }, // 76
    { fileId: 0xD9A9,  type: ResourceType.Dmsg,         description: 'Missions - Treasures of Aht Urhgan' }, // 77
    { fileId: 0xD9AC,  type: ResourceType.Dmsg,         description: 'Quests - Campaign Ops' }, // 78
    { fileId: 0xD9AB,  type: ResourceType.Dmsg,         description: 'Missions - Wings of the Goddess' }, // 79
    { fileId: 0xD9B7,  type: ResourceType.Dmsg,         description: 'Missions - A Crystalline Prophecy' }, // 80
    { fileId: 0xD9B8,  type: ResourceType.Dmsg,         description: 'Missions - A Moogle Kupo d\'Etat' }, // 81
    { fileId: 0xD9B9,  type: ResourceType.Dmsg,         description: 'Missions - A Shantotto Ascension' }, // 82
    { fileId: 0xD9BA,  type: ResourceType.Dmsg,         description: 'Missions - Seekers of Adoulin' }, // 83
    { fileId: 0xD9BD,  type: ResourceType.Dmsg,         description: 'Missions - Rhapsodies of Vana\'diel' }, // 84
    { fileId: 0xD9BE,  type: ResourceType.Dmsg,         description: '<Unknown>' }, // 85
    { fileId: 0xD9BB,  type: ResourceType.Dmsg,         description: 'Quests - Seekers of Adoulin' }, // 86
    { fileId: 0xD9BC,  type: ResourceType.Dmsg,         description: 'Quests - Coalition Assignments' }, // 87
    { fileId: 0x52,    type: ResourceType.ChunkedResource, description: 'Resource - <Unknown>' }, // 88
    { fileId: 0x51,    type: ResourceType.ChunkedResource, description: 'Resource - <Unknown>' }, // 89
    { fileId: 0xD9B4,  type: ResourceType.Dmsg,         description: 'Status Names with Adjectives' }, // 90
    { fileId: 0xD996,  type: ResourceType.Dmsg,         description: 'Spell Names' }, // 91
    { fileId: 0xD9B6,  type: ResourceType.Dmsg,         description: 'Spell Help Text' }, // 92
    { fileId: 0xD995,  type: ResourceType.Dmsg,         description: 'Ability Names' }, // 93
    { fileId: 0xD9B5,  type: ResourceType.Dmsg,         description: 'Ability Help Text' }, // 94
    { fileId: 0xD981,  type: ResourceType.Dmsg,         description: 'Mount Names' }, // 95
    { fileId: 0xD982,  type: ResourceType.Dmsg,         description: 'Mount Help Text' }, // 96
    { fileId: 0x1B6D,  type: ResourceType.EventMessage, description: 'Skill Names' }, // 97
    { fileId: 0x1B6F,  type: ResourceType.EventMessage, description: 'Modifier Flags' }, // 98
    { fileId: 0x1B71,  type: ResourceType.EventMessage, description: 'Emotes' }, // 99
    { fileId: 0x1B73,  type: ResourceType.EventMessage, description: 'Ability Messages' }, // 100
    { fileId: 0x1B75,  type: ResourceType.EventMessage, description: 'Status Names' }, // 101
    { fileId: 0x1B77,  type: ResourceType.EventMessage, description: 'System Messages' }, // 102
    { fileId: 0x1B7B,  type: ResourceType.EventMessage, description: 'Ability Names (256+)' }, // 103
    { fileId: 0x1B7F,  type: ResourceType.EventMessage, description: 'Unity Messages' }, // 104
];

// 0x17E8 0xE239 0x10A73 0x14D2B
// 0x1914 0xE259 0x10B9F 0x14E57
// 0xDA39 0xE279 0x10CCB 0x14F83
// 0xDBDD 0xE299 0x10DF7 0x150AF

// { fileId: 0x1914,  type: ResourceType.EventMessage, description: '<Unknown>' }, // 105 (Zone Event Messages 0-255)
// { fileId: 0xE259,  type: ResourceType.EventMessage, description: '<Unknown>' }, // 106 (Zone Event Messages 1000-1999)
// { fileId: 0x10B9F, type: ResourceType.EventMessage, description: '<Unknown>' }, // 107 (Zone Event Messages 2000+)
// { fileId: 0x14E57, type: ResourceType.EventMessage, description: '<Unknown>' }, // 108 (Zone Event Messages 256-999)

export function init(fileList: string[]) {
    database.length = 0;

    // Copy over common resources.
    for (const entry of commonResources) {
        database.push(entry);
    }

    // Temporary for testing:
    // The 2000+ range is actually 1000+
    // Localized resource 106 is then the base for certain events

    // Per-zone event messages.
    for (let i = 0; i < 256; i++) {
        const entityListId = 0x1A40 + i;

        if (fileList[entityListId]) {
            database.push({
                fileId: entityListId,
                type: ResourceType.EntityList,
                description: `Entity List - Zone ${i}`,
            })
        }

        const fileIdJP = 0x17E8 + i;

        if (fileList[fileIdJP]) {
            database.push({
                fileId: fileIdJP,
                type: ResourceType.EventMessage,
                description: `Zone ${i} (JP)`,
            })
        }

        const fileIdEN = 0x1914 + i;

        if (fileList[fileIdEN]) {
            database.push({
                fileId: fileIdEN,
                type: ResourceType.EventMessage,
                description: `Zone ${i} (EN)`,
            })
        }

        const fileIdDE = 0xDA39 + i;

        if (fileList[fileIdDE]) {
            database.push({
                fileId: fileIdDE,
                type: ResourceType.EventMessage,
                description: `Zone ${i} (DE)`,
            })
        }

        const fileIdFR = 0xDBDD + i;

        if (fileList[fileIdFR]) {
            database.push({
                fileId: fileIdFR,
                type: ResourceType.EventMessage,
                description: `Zone ${i} (FR)`,
            })
        }
    }

    // Looks like the range here is 256-555 before hitting the German versions.
    for (let i = 256; i < 555; i++) {
        const entityListId = 0x150DB + i;

        if (fileList[entityListId]) {
            database.push({
                fileId: entityListId,
                type: ResourceType.EntityList,
                description: `Entity List - Zone ${i}`,
            })
        }

        const fileId = 0x14E57 + i - 256;

        if (fileList[fileId]) {
            database.push({
                fileId,
                type: ResourceType.EventMessage,
                description: `Zone ${i} (EN)`,
            })
        }
    }

    // Looks like the range here is 32 before hitting the German versions.
    for (let i = 1000; i < 1000 + 32; i++) {
        const fileId = 0xE259 + i - 1000;

        if (fileList[fileId]) {
            database.push({
                fileId,
                type: ResourceType.EventMessage,
                description: `Zone ${i} (EN)`,
            })
        }
    }

    // Looks like the range here is 300 before hitting the German versions.
    for (let i = 2000; i < 2000 + 300; i++) {
        const entityListId = 0x1055F + i - 1000;

        if (fileList[entityListId]) {
            database.push({
                fileId: entityListId,
                type: ResourceType.EntityList,
                description: `Entity List - Zone ${i}`,
            })
        }

        const fileId = 0x10B9F + i - 2000;

        if (fileList[fileId]) {
            database.push({
                fileId,
                type: ResourceType.EventMessage,
                description: `Zone ${i} (EN)`,
            })
        }
    }
}
