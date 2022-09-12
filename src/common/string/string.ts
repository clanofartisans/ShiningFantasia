import {
    ShiftJISTable,
    ShiftJISBytes,
    ShiftJISEventTable,
    ShiftJISEventBytes,
    SpecialCode
} from './Shift_JIS';

function convertSpecial(orig: number, code: SpecialCode, param: Buffer | never[]): string {
    switch (code) {
        default:
        case SpecialCode.UNKNOWN: {
            const pad = (orig > 255) ? 4 : 2;

            switch (param.length) {
                default:
                    return `<${orig.toString(16).toUpperCase().padStart(pad, '0')}:${Array.prototype.map.call(param, x => x.toString(16).toUpperCase().padStart(2, '0')).join(',')}>`;
                case 0:
                    return `<${orig.toString(16).toUpperCase().padStart(pad, '0')}>`;
            }
        }

        // todo - fix paramter names - {action/event/target/party/memberid/player/etc.:index:format}

        case SpecialCode.UNKNOWN_CHAR:
            return `\\x${orig.toString(16).padStart(2, '0')}`;

        case SpecialCode.NUL:
            return '\\0';

        case SpecialCode.SET_X:
            return `{setX=${param[1] * 256 + param[0]}}`;

        case SpecialCode.SET_Y:
            return `{setY=${param[1] * 256 + param[0]}}`;

        case SpecialCode.SKILL_TEXT:
            // Ability
            return `{a${param[0]}:skillText}`;

        case SpecialCode.PLAYER_NAME:
            return '{player:name}';

        case SpecialCode.NPC_NAME:
            return '{npc:name}';

        case SpecialCode.VALUE:
            return `{${param[0]}}`;

        case SpecialCode.INDEX:
            return `{${param[0]}:select}`;

        case SpecialCode.SOUND_EFFECT:
            // Action?
            return `{a${param[0]}:soundEffect}`;

        case SpecialCode.EVENT_SOUND_EFFECT:
            return `{${param[0]}:soundEffect}`;

        case SpecialCode.SPELL_NAME:
            // Action?
            return `{a${param[0]}:spellName}`;

        case SpecialCode.EVENT_SPELL_NAME:
            return `{${param[0]}:spellName}`;

        case SpecialCode.NUMBER:
            // Action?
            // Number with digit group separators
            return `{a${param[0]}:number}`;

        case SpecialCode.TIME:
            // Action?
            return `{a${param[0]}:time}`;

        case SpecialCode.ABILITY_NAME:
            // Action?
            return `{a${param[0]}:abilityName}`;

        case SpecialCode.PARTY_MEMBER_NAME_BY_ID:
            return `{member${param[0]}i:name}`;

        case SpecialCode.PARTY_MEMBER_NAME:
            return `{member${param[0]}:name}`;

        case SpecialCode.EVENT_ABILITY_NAME:
            return `{${param[0]}:abilityName}`;

        case SpecialCode.EVENT_STRING:
            return `{es${param[0]}}`;

        case SpecialCode.HEADING:
            return '{npc:heading}';

        case SpecialCode.ABILITY_MODIFIERS:
            return `{ability:modifiers:${param[0]}}`;

        case SpecialCode.PLAYER_GENDER:
            return '{player:gender:select}';

        case SpecialCode.ABILITY_PLURAL_SELECT:
            return `{a${param[0]}:pluralSelect}`;

        case SpecialCode.NPC_PLURAL_SELECT:
            return `{npc:${param[0]}:pluralSelect}`;

        case SpecialCode.NPC_PROPER_SELECT:
            return `{npc:${param[0]}:properSelect}`;

        case SpecialCode.ABILITY_NAME2:
            // Action?
            // Action names are offset by 512.
            return `{a${param[0]}:abilityName2}`;

        case SpecialCode.NPC0_GENDER:
            return '{npc:0:gender}';

        case SpecialCode.NPC1_GENDER:
            return '{npc:1:gender}';

        case SpecialCode.PLURAL_SELECT:
            return `{${param[0]}:pluralSelect}`;

        case SpecialCode.SPECIAL_NAME:
            // One of the parameters passed into the EventMessageFormatter.
            // Source depends on how the message was generated.
            return `{special_name}`;

        case SpecialCode.TWO_DIGIT_VALUE:
            return `{${param[0]}:02d}`;

        case SpecialCode.FOUR_DIGIT_VALUE:
            return `{${param[0]}:04d}`;

        case SpecialCode.HEX_VALUE:
            // $ left out to avoid confusion
            return `{${param[0]}:x}`;

        case SpecialCode.BINARY_VALUE:
            return `{${param[0]}:b}`;

        case SpecialCode.NEWLINE:
            return '\\n';

        case SpecialCode.TAB:
            return '\\t';
    }
}

function decode(byteTable: number[], table: number[], strBuf: Buffer): string {
    let s = '';

    for (let i = 0; i < strBuf.length;) {
        let c = strBuf[i];

        const bytes = byteTable[c];
        if (bytes > 1) {
            const c1 = (i+1) < strBuf.length ? strBuf[i+1] : 0;
            c = (c << 8) | c1;
        }
        i += bytes;

        if (c === 0) {
            // End of the string.
            break;
        }

        const codePoint = table[c];
        if (codePoint < 0) {
            const code = -codePoint;
            const special = (code & 0xffff) as SpecialCode;
            const extra = (code >> 16);

            const param = (extra > 0) ? ((i+extra) < strBuf.length ? strBuf.subarray(i, i + extra) : []) : [];
            i += extra;

            s += convertSpecial(c, special, param);
        } else if (codePoint > 0) {
            s += String.fromCodePoint(codePoint);
        } else {
            if (bytes === 2) {
                // \uXXXX
                s += `\\u${c.toString(16).toUpperCase().padStart(4, '0')}`;
            } else if (bytes === 1) {
                // \xXX
                s += `\\x${c.toString(16).toUpperCase().padStart(2, '0')}`;
            } else {
                // todo - \xAA\xBB\xCC
                // not supposed to ever happen, but just in case
                s += `\\Z${bytes}${c.toString(16).toUpperCase().padStart(bytes * 2, '0')}`;
            }
        }
    }

    return s;
}

export function decodeString(strBuf: Buffer): string {
    // The encoding is kinda Shift_JIS, but has a lot of
    // non-standard bytes.

    return decode(ShiftJISBytes, ShiftJISTable, strBuf);
}

export function decodeEventString(strBuf: Buffer): string {
    // The encoding is kinda Shift_JIS, but has a lot of
    // non-standard bytes.

    return decode(ShiftJISEventBytes, ShiftJISEventTable, strBuf);
}

export function encodeString(str: string, isEnglish?: boolean): Buffer {
    // The encoding is kinda Shift_JIS, but has a lot of
    // non-standard bytes.

    // alloc a large temporary buffer
    const buf = Buffer.alloc(str.length * 16 + 4);
    let offset = 0;

    // convert to an array of code points for easier iteration
    const cp: number[] = [];

    for (const cpStr of str) {
        cp.push(cpStr.codePointAt(0)!);
    }

    // Try to auto-detect if the parameter was not given.
    // Only useful when testing by naive file output comparisons.
    isEnglish = isEnglish ?? (cp.length > 0 && cp[0] < 128);

    for (let i = 0; i < cp.length; i++) {
        const c = cp[i]!;

        const r = cp.length - i - 1;

        if (c < 0x80) {
            switch (c) {
                case 92: // '\'
                    // '\t'
                    if (r > 0 && cp[i+1] == 116) {
                        buf[offset] = 0x09;
                        offset++;
                        i++;
                        continue;
                    }
                    // '\n'
                    if (r > 0 && cp[i+1] == 110) {
                        buf[offset] = 0x0A;
                        offset++;
                        i++;
                        continue;
                    }
                    // '\uxxxx'
                    if (r > 4 && cp[i+1] == 117) {
                        const hex = `${String.fromCodePoint(cp[i+2]!)}${String.fromCodePoint(cp[i+3]!)}${String.fromCodePoint(cp[i+4]!)}${String.fromCodePoint(cp[i+5]!)}`;
                        const code = parseInt(hex, 16);
                        buf.writeUInt16BE(code, offset);
                        offset += 2;
                        i += 5;
                        continue;
                    }
                    // '\xxx'
                    if (r > 2 && cp[i+1] == 120) {
                        const hex = `${String.fromCodePoint(cp[i+2]!)}${String.fromCodePoint(cp[i+3]!)}`;
                        const code = parseInt(hex, 16);
                        buf.writeUInt8(code, offset);
                        offset += 1;
                        i += 3;
                        continue;
                    }
                    break;
            }

            // any other ascii character
            buf[offset] = c;
            offset++;
        } else {
            let found = false;
            for (let j = 0; j < 65536; j++) {
                if (ShiftJISTable[j] == c) {
                    // Fix up ambiguous glyph mappings in the English text
                    if (isEnglish) {
                        if (c == 0x00D7) j = 0x85B6;
                        if (c == 0x2019) j = 0x8552;
                        if (c == 0x2026) j = 0x8545;
                    }
                    buf.writeUInt16BE(j, offset);
                    offset += 2;
                    found = true;
                    break;
                }
            }
            if (!found) {
                console.log('brute force lookup failed!');
            }
        }
    }

    // pad up
    const size = (offset + 4) & ~3;

    // write trailing null bytes (safe because enough space was preallocated!)
    buf.writeInt32LE(0, offset);

    return buf.subarray(0, size);
}

export function encodeEventString(str: string): Buffer {
    // The encoding is kinda Shift_JIS, but has a lot of
    // non-standard bytes.

    // placeholder
    const tmp = Buffer.alloc(4);
    tmp.writeInt32LE(0);
    return tmp;
}
