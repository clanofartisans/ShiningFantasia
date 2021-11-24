import iconv from 'iconv-lite';

export function decodeXiString(strBuf: Buffer): string {
    // The encoding is kinda Shift_JIS, but has a lot of
    // non-standard bytes.
    return iconv.decode(strBuf, 'Shift_JIS');
}
