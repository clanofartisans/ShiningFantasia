import iconv from 'iconv-lite';

const useIconv = false;

function slowDecode(strBuf: Buffer): string {
    let s = '';

    // Try converting the string byte-by-byte.
    // This will one day need to use a modified Shift_JIS
    // conversion to handle all of the custom codes.

    for (let i = 0; i < strBuf.length; i++) {
        const c = strBuf[i];
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

    return s;
}

export function decodeXiString(strBuf: Buffer): string {
    // The encoding is kinda Shift_JIS, but has a lot of
    // non-standard bytes.

    if (useIconv) {
        return iconv.decode(strBuf, 'Shift_JIS');
    }
    return slowDecode(strBuf);
}
