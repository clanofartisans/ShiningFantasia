import { lsb8, lsb16, lsb24, lsb32 } from '../bytes';
import { decodeString } from '../string';

function expand4to8(x: number): number {
    return ((x * 255) / 15);
}

function expand5to16(x: number): number {
    return ((x * 65535) / 31);
}

function expand6to16(x: number): number {
    return ((x * 65535) / 63);
}

function int1to1(a: number, b: number): number {
    return ((a + b) / 2);
}

function int2to1(a: number, b: number): number {
    return ((2 * a + b) / 3);
}

export class Bmp2 {
    textureName: string;
    width: number;
    height: number;

    bitsPerPixel: number;
    paletteBitsPerPixel: number;
    compressedTextureFourCC: number;

    palette: Buffer | null;
    texture: Buffer | null;
    compressedTexture: Buffer | null;

    constructor(b: Buffer) {
        const versionFlags = lsb8(b, 0);
        const isCompressed = versionFlags >> 7;
        const version = (versionFlags >> 4) & 7;

        const textureName = b.subarray(1, 17);

        const width = lsb32(b, 21);
        const height = lsb32(b, 25);

        const bitsPerPixel = lsb8(b, 31);
        const paletteBitsPerPixel = lsb8(b, 53);

        let paletteOffset = 0;
        let paletteSize = 0;
        let textureOffset = 0;
        let textureSize = 0;
        let compressedTextureOffset = 0;
        let compressedTextureSize = 0;
        let fourCC = 0;
        let UnknownDxt1 = 0;
        let flags = 0;

        let offset = 57;

        if (version === 3) {
            flags = lsb32(b, offset);
            offset += 4;
        }

        if (version !== 2) {
            if (bitsPerPixel == 4) {
                paletteOffset = offset;

                paletteSize = 16 * paletteBitsPerPixel / 8;
            } else if (bitsPerPixel == 8) {
                paletteOffset = offset;

                paletteSize = 256 * paletteBitsPerPixel / 8;
            } else {
                // not supported
            }

            offset += paletteSize;

            textureOffset = offset;
            textureSize = bitsPerPixel * width * height / 8;

            offset += textureSize;
        }

        if (isCompressed && offset < b.length - 4) {
            fourCC = lsb32(b, offset);
            offset += 4;

            if (fourCC >= 0x44585431 && fourCC <= 0x44585435) {
                compressedTextureSize = lsb32(b, offset + 0);
                UnknownDxt1 = lsb32(b, offset + 4);
                offset += 8;

                compressedTextureOffset = offset;

                if (fourCC == 0x44585431) {
                    compressedTextureSize = 8 * width * height / 16;
                } else if (fourCC == 0x44585432 || fourCC == 0x44585433) {
                    compressedTextureSize = 16 * width * height / 16;
                } else if (fourCC == 0x44585434 || fourCC == 0x44585435) {
                    compressedTextureSize = 16 * width * height / 16;
                }

                offset += compressedTextureSize;
            }
        }

        this.textureName = decodeString(textureName);

        this.width = width;
        this.height = height;

        this.bitsPerPixel = bitsPerPixel;
        this.paletteBitsPerPixel = paletteBitsPerPixel;
        this.compressedTextureFourCC = fourCC;

        if (paletteOffset > 0) {
            this.palette = b.subarray(paletteOffset, paletteOffset + paletteSize);
        } else {
            this.palette = null;
        }

        if (textureOffset > 0) {
            this.texture = b.subarray(textureOffset, textureOffset + textureSize);
        } else {
            this.texture = null;
        }

        if (compressedTextureOffset > 0) {
            this.compressedTexture = b.subarray(compressedTextureOffset, compressedTextureOffset + compressedTextureSize);
        } else {
            this.compressedTexture = null;
        }
    }

    decompressDXT1() : Uint8ClampedArray | null {
        if (!this.compressedTexture) {
            return null;
        }

        const width = this.width;
        const height = this.height;

        const uncompressedSize = 4 * width * height;

        const out = new Uint8ClampedArray(uncompressedSize);

        const pitch = width * 4;
        let ioff = 0;
        let off = 0;

        for (let y = 0; y < height; y += 4) {
            for (let x = 0; x < width; x += 4) {
                const p0 = this.compressedTexture[ioff + 0];
                const p1 = this.compressedTexture[ioff + 1];
                const p2 = this.compressedTexture[ioff + 2];
                const p3 = this.compressedTexture[ioff + 3];
                const p4 = this.compressedTexture[ioff + 4];
                const p5 = this.compressedTexture[ioff + 5];
                const p6 = this.compressedTexture[ioff + 6];
                const p7 = this.compressedTexture[ioff + 7];
                ioff += 8;

                const c0 = (p1 << 8) | p0;
                const c1 = (p3 << 8) | p2;

                const cia = (p4 >> 0) & 0x3;
                const cib = (p4 >> 2) & 0x3;
                const cic = (p4 >> 4) & 0x3;
                const cid = (p4 >> 6) & 0x3;
                const cie = (p5 >> 0) & 0x3;
                const cif = (p5 >> 2) & 0x3;
                const cig = (p5 >> 4) & 0x3;
                const cih = (p5 >> 6) & 0x3;
                const cii = (p6 >> 0) & 0x3;
                const cij = (p6 >> 2) & 0x3;
                const cik = (p6 >> 4) & 0x3;
                const cil = (p6 >> 6) & 0x3;
                const cim = (p7 >> 0) & 0x3;
                const cin = (p7 >> 2) & 0x3;
                const cio = (p7 >> 4) & 0x3;
                const cip = (p7 >> 6) & 0x3;

                const c0r = expand5to16(c0 >> 11);
                const c1r = expand5to16(c1 >> 11);
                const c0g = expand6to16((c0 >> 5) & 0x3f);
                const c1g = expand6to16((c1 >> 5) & 0x3f);
                const c0b = expand5to16(c0 & 0x1f);
                const c1b = expand5to16(c1 & 0x1f);
                const c0a = 255;
                const c1a = 255;

                const a = (c0 <= c1);

                const c2r = a ? int1to1(c0r, c1r) : int2to1(c0r, c1r);
                const c3r = a ? 0 : int2to1(c1r, c0r);
                const c2g = a ? int1to1(c0g, c1g) : int2to1(c0g, c1g);
                const c3g = a ? 0 : int2to1(c1g, c0g);
                const c2b = a ? int1to1(c0b, c1b) : int2to1(c0b, c1b);
                const c3b = a ? 0: int2to1(c1b, c0b);
                const c2a = 255;
                const c3a = a ? 0 : 255;

                const cr = [ c0r >> 8, c1r >> 8, c2r >> 8, c3r >> 8 ];
                const cg = [ c0g >> 8, c1g >> 8, c2g >> 8, c3g >> 8 ];
                const cb = [ c0b >> 8, c1b >> 8, c2b >> 8, c3b >> 8 ];
                const ca = [ c0a, c1a, c2a, c3a ];

                let boff = off;

                out[boff+0] = cr[cia];
                out[boff+1] = cg[cia];
                out[boff+2] = cb[cia];
                out[boff+3] = ca[cia];
                out[boff+4] = cr[cib];
                out[boff+5] = cg[cib];
                out[boff+6] = cb[cib];
                out[boff+7] = ca[cib];
                out[boff+8] = cr[cic];
                out[boff+9] = cg[cic];
                out[boff+10] = cb[cic];
                out[boff+11] = ca[cic];
                out[boff+12] = cr[cid];
                out[boff+13] = cg[cid];
                out[boff+14] = cb[cid];
                out[boff+15] = ca[cid];

                boff += pitch;

                out[boff+0] = cr[cie];
                out[boff+1] = cg[cie];
                out[boff+2] = cb[cie];
                out[boff+3] = ca[cie];
                out[boff+4] = cr[cif];
                out[boff+5] = cg[cif];
                out[boff+6] = cb[cif];
                out[boff+7] = ca[cif];
                out[boff+8] = cr[cig];
                out[boff+9] = cg[cig];
                out[boff+10] = cb[cig];
                out[boff+11] = ca[cig];
                out[boff+12] = cr[cih];
                out[boff+13] = cg[cih];
                out[boff+14] = cb[cih];
                out[boff+15] = ca[cih];

                boff += pitch;

                out[boff+0] = cr[cii];
                out[boff+1] = cg[cii];
                out[boff+2] = cb[cii];
                out[boff+3] = ca[cii];
                out[boff+4] = cr[cij];
                out[boff+5] = cg[cij];
                out[boff+6] = cb[cij];
                out[boff+7] = ca[cij];
                out[boff+8] = cr[cik];
                out[boff+9] = cg[cik];
                out[boff+10] = cb[cik];
                out[boff+11] = ca[cik];
                out[boff+12] = cr[cil];
                out[boff+13] = cg[cil];
                out[boff+14] = cb[cil];
                out[boff+15] = ca[cil];

                boff += pitch;

                out[boff+0] = cr[cim];
                out[boff+1] = cg[cim];
                out[boff+2] = cb[cim];
                out[boff+3] = ca[cim];
                out[boff+4] = cr[cin];
                out[boff+5] = cg[cin];
                out[boff+6] = cb[cin];
                out[boff+7] = ca[cin];
                out[boff+8] = cr[cio];
                out[boff+9] = cg[cio];
                out[boff+10] = cb[cio];
                out[boff+11] = ca[cio];
                out[boff+12] = cr[cip];
                out[boff+13] = cg[cip];
                out[boff+14] = cb[cip];
                out[boff+15] = ca[cip];

                off += 16;
            }

            off += pitch * 3;
        }

        return out;
    }

    decompressDXT3() : Uint8ClampedArray | null {

        if (!this.compressedTexture) {
            return null;
        }

        const width = this.width;
        const height = this.height;

        const uncompressedSize = 4 * width * height;

        const out = new Uint8ClampedArray(uncompressedSize);

        const pitch = width * 4;
        let ioff = 0;
        let off = 0;

        for (let y = 0; y < height; y += 4) {
            for (let x = 0; x < width; x += 4) {
                const p0 = this.compressedTexture[ioff + 0];
                const p1 = this.compressedTexture[ioff + 1];
                const p2 = this.compressedTexture[ioff + 2];
                const p3 = this.compressedTexture[ioff + 3];
                const p4 = this.compressedTexture[ioff + 4];
                const p5 = this.compressedTexture[ioff + 5];
                const p6 = this.compressedTexture[ioff + 6];
                const p7 = this.compressedTexture[ioff + 7];
                const p8 = this.compressedTexture[ioff + 8];
                const p9 = this.compressedTexture[ioff + 9];
                const pa = this.compressedTexture[ioff + 10];
                const pb = this.compressedTexture[ioff + 11];
                const pc = this.compressedTexture[ioff + 12];
                const pd = this.compressedTexture[ioff + 13];
                const pe = this.compressedTexture[ioff + 14];
                const pf = this.compressedTexture[ioff + 15];
                ioff += 16;

                // extract and rescale alpha
                // the scaling normally happens in the pixel shader.
                const aa = expand4to8((p0 >> 0) & 0xf) * 255 / 128;
                const ab = expand4to8((p0 >> 4) & 0xf) * 255 / 128;
                const ac = expand4to8((p1 >> 0) & 0xf) * 255 / 128;
                const ad = expand4to8((p1 >> 4) & 0xf) * 255 / 128;
                const ae = expand4to8((p2 >> 0) & 0xf) * 255 / 128;
                const af = expand4to8((p2 >> 4) & 0xf) * 255 / 128;
                const ag = expand4to8((p3 >> 0) & 0xf) * 255 / 128;
                const ah = expand4to8((p3 >> 4) & 0xf) * 255 / 128;
                const ai = expand4to8((p4 >> 0) & 0xf) * 255 / 128;
                const aj = expand4to8((p4 >> 4) & 0xf) * 255 / 128;
                const ak = expand4to8((p5 >> 0) & 0xf) * 255 / 128;
                const al = expand4to8((p5 >> 4) & 0xf) * 255 / 128;
                const am = expand4to8((p6 >> 0) & 0xf) * 255 / 128;
                const an = expand4to8((p6 >> 4) & 0xf) * 255 / 128;
                const ao = expand4to8((p7 >> 0) & 0xf) * 255 / 128;
                const ap = expand4to8((p7 >> 4) & 0xf) * 255 / 128;

                const c0 = (p9 << 8) | p8;
                const c1 = (pb << 8) | pa;

                const cia = (pc >> 0) & 0x3;
                const cib = (pc >> 2) & 0x3;
                const cic = (pc >> 4) & 0x3;
                const cid = (pc >> 6) & 0x3;
                const cie = (pd >> 0) & 0x3;
                const cif = (pd >> 2) & 0x3;
                const cig = (pd >> 4) & 0x3;
                const cih = (pd >> 6) & 0x3;
                const cii = (pe >> 0) & 0x3;
                const cij = (pe >> 2) & 0x3;
                const cik = (pe >> 4) & 0x3;
                const cil = (pe >> 6) & 0x3;
                const cim = (pf >> 0) & 0x3;
                const cin = (pf >> 2) & 0x3;
                const cio = (pf >> 4) & 0x3;
                const cip = (pf >> 6) & 0x3;

                const c0r = expand5to16(c0 >> 11);
                const c1r = expand5to16(c1 >> 11);
                const c0g = expand6to16((c0 >> 5) & 0x3f);
                const c1g = expand6to16((c1 >> 5) & 0x3f);
                const c0b = expand5to16(c0 & 0x1f);
                const c1b = expand5to16(c1 & 0x1f);

                const c2r = int2to1(c0r, c1r);
                const c3r = int2to1(c1r, c0r);
                const c2g = int2to1(c0g, c1g);
                const c3g = int2to1(c1g, c0g);
                const c2b = int2to1(c0b, c1b);
                const c3b = int2to1(c1b, c0b);

                const cr = [ c0r >> 8, c1r >> 8, c2r >> 8, c3r >> 8 ];
                const cg = [ c0g >> 8, c1g >> 8, c2g >> 8, c3g >> 8 ];
                const cb = [ c0b >> 8, c1b >> 8, c2b >> 8, c3b >> 8 ];

                let boff = off;

                out[boff+0] = cr[cia];
                out[boff+1] = cg[cia];
                out[boff+2] = cb[cia];
                out[boff+3] = aa;
                out[boff+4] = cr[cib];
                out[boff+5] = cg[cib];
                out[boff+6] = cb[cib];
                out[boff+7] = ab;
                out[boff+8] = cr[cic];
                out[boff+9] = cg[cic];
                out[boff+10] = cb[cic];
                out[boff+11] = ac;
                out[boff+12] = cr[cid];
                out[boff+13] = cg[cid];
                out[boff+14] = cb[cid];
                out[boff+15] = ad;

                boff += pitch;

                out[boff+0] = cr[cie];
                out[boff+1] = cg[cie];
                out[boff+2] = cb[cie];
                out[boff+3] = ae;
                out[boff+4] = cr[cif];
                out[boff+5] = cg[cif];
                out[boff+6] = cb[cif];
                out[boff+7] = af;
                out[boff+8] = cr[cig];
                out[boff+9] = cg[cig];
                out[boff+10] = cb[cig];
                out[boff+11] = ag;
                out[boff+12] = cr[cih];
                out[boff+13] = cg[cih];
                out[boff+14] = cb[cih];
                out[boff+15] = ah;

                boff += pitch;

                out[boff+0] = cr[cii];
                out[boff+1] = cg[cii];
                out[boff+2] = cb[cii];
                out[boff+3] = ai;
                out[boff+4] = cr[cij];
                out[boff+5] = cg[cij];
                out[boff+6] = cb[cij];
                out[boff+7] = aj;
                out[boff+8] = cr[cik];
                out[boff+9] = cg[cik];
                out[boff+10] = cb[cik];
                out[boff+11] = ak;
                out[boff+12] = cr[cil];
                out[boff+13] = cg[cil];
                out[boff+14] = cb[cil];
                out[boff+15] = al;

                boff += pitch;

                out[boff+0] = cr[cim];
                out[boff+1] = cg[cim];
                out[boff+2] = cb[cim];
                out[boff+3] = am;
                out[boff+4] = cr[cin];
                out[boff+5] = cg[cin];
                out[boff+6] = cb[cin];
                out[boff+7] = an;
                out[boff+8] = cr[cio];
                out[boff+9] = cg[cio];
                out[boff+10] = cb[cio];
                out[boff+11] = ao;
                out[boff+12] = cr[cip];
                out[boff+13] = cg[cip];
                out[boff+14] = cb[cip];
                out[boff+15] = ap;

                off += 16;
            }

            off += pitch * 3;
        }

        return out;
    }

    decompressTexture() : Uint8ClampedArray | null {
        if (this.compressedTextureFourCC === 0x44585431) {
            return this.decompressDXT1();
        } else if (this.compressedTextureFourCC === 0x44585433) {
            return this.decompressDXT3();
        }
        return null;
    }

    getRGBABuffer() :  Uint8ClampedArray | null {
        if (this.compressedTexture && !this.palette/*Until the below is complete*/) {
            return this.decompressTexture();
        }

        // Hardcoded to only support BPP8 PBPP32 for the time being.
        if (!this.palette) {
            return null;
        }
        if (!this.texture) {
            return null;
        }
        if (this.bitsPerPixel !== 8 || this.paletteBitsPerPixel !== 32) {
            return null;
        }

        const width = this.width;
        const height = this.height;

        const uncompressedSize = this.paletteBitsPerPixel * width * height / 8;
        const b =  new Uint8ClampedArray(uncompressedSize);

        let offset = 0;

        // Flip the image
        for (let y = height - 1; y >= 0; y--) {
            for (let x = 0; x < width; x++) {
                const p = this.texture[y * width + x];

                // BGRA -> RGBA
                b[offset + 0] = this.palette[p * 4 + 2];
                b[offset + 1] = this.palette[p * 4 + 1];
                b[offset + 2] = this.palette[p * 4 + 0];

                // rescale alpha for the icon textures
                b[offset + 3] = this.palette[p * 4 + 3] * 255 / 128;

                offset += 4;
            }
        }

        return b;
    }
}
