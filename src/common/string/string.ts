import { ShiftJISTable, ShiftJISBytes, SpecialCode } from './Shift_JIS';

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

        case SpecialCode.UNKNOWN_CHAR:
            return `\\x${orig.toString(16).padStart(2, '0')}`;

        case SpecialCode.NUL:
            return '\\0';

        case SpecialCode.PLAYER_NAME:
            return '{playerName}';
    }
}

export function decodeXiString(strBuf: Buffer): string {
    // The encoding is kinda Shift_JIS, but has a lot of
    // non-standard bytes.

    let s = '';

    for (let i = 0; i < strBuf.length;) {
        let c = strBuf[i];

        const bytes = ShiftJISBytes[c];
        if (bytes > 1) {
            const c1 = (i+1) < strBuf.length ? strBuf[i+1] : 0;
            c = (c << 8) | c1;
        }
        i += bytes;

        const codePoint = ShiftJISTable[c];
        if (codePoint < 0) {
            const code = -codePoint;
            const special = (code & 0xffff) as SpecialCode;
            const extra = (code >> 16);

            const param = (extra > 0) ? ((i+extra) < strBuf.length ? strBuf.slice(i, i + extra) : []) : [];
            i += extra;

            s += convertSpecial(c, special, param);
        } else if (codePoint > 0) {
            s += String.fromCodePoint(codePoint);
        } else {
            s += `<${c.toString(16).toUpperCase().padStart(bytes * 2, '0')}>`;
        }
    }

/*
        const c1 = (i+1) < strBuf.length ? strBuf[i+1] : 0xffff;
        const c2 = (i+2) < strBuf.length ? strBuf[i+2] : 0xffff;

        if (c == 0x7b) {
            // Ascii '{'
            s += '{{';
            continue;
        }

        if (c == 0x7d) {
            // Ascii '}'
            s += '}}';
        }

        if (c >= 0x20 && c <= 0x7e) {
            // Printable ASCII.
            s += String.fromCharCode(c);
            continue;
        }

        // Now for the real "fun"!

        // Special formatters

        if (c == 0xa && c1 >= 0 && c1 <= 9) {
            // Number
            const param = c1;
            s += `{${param}}`;
            i++;
            continue;
        }

        if (c == 0xc && c1 >= 0 && c1 <= 9) {
            // Index selector
            const param = c1;
            s += `{${param}:index}`;
            i++;
            continue;
        }

        // 7f 85/90/91 - gender selectors
        // 90/91 are ?
        if (c == 0x75 && c1 == 0x85) {
            // Player's gender
            s += `{gender}`;
            i++;
            continue;
        }

        if (c == 0x82 && c1 >= 0x80 && c1 <= 0x89) {
            // Item name
            const param = c1 - 0x80;
            s += `{${param}:item}`;
            i++;
            continue;
        }

        if (c == 0x7f && c1 == 0x92 && c2 >= 0 && c2 <= 9) {
            // Singular/plural selector
            const param = c2;
            s += `{${param}:s_p}`;
            i += 2;
            continue;
        }

        // Non-standard Shift_JIS

        if (c == 0x85 && c1 == 0xdb) {
            // ü
            s += 'ü';
            i++;
            continue;
        }

        // Known multi-character sequences that aren't yet converted.

        if (c == 0xef) {
            s += `<${c.toString(16).toUpperCase().padStart(2, '0')}${c1.toString(16).toUpperCase().padStart(2, '0')}>`;
            i++;
            continue;
        }

        // Unhandled, just output the hex.
        s += `<${c.toString(16).toUpperCase().padStart(2, '0')}>`;
    }
*/
    return s;
}
