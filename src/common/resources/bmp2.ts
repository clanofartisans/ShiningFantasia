import { lsb8, lsb16, lsb24, lsb32 } from '../bytes';
import { decodeString } from '../string';

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

        const textureName = b.slice(1, 17);

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
                    compressedTextureOffset = 8 * width * height / 16;
                } else if (fourCC == 0x44585432 || fourCC == 0x44585433) {
                    compressedTextureOffset = 16 * width * height / 16;
                } else if (fourCC == 0x44585434 || fourCC == 0x44585435) {
                    compressedTextureOffset = 16 * width * height / 16;
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
            this.palette = b.slice(paletteOffset, paletteOffset + paletteSize);
        } else {
            this.palette = null;
        }

        if (textureOffset > 0) {
            this.texture = b.slice(textureOffset, textureOffset + textureSize);
        } else {
            this.texture = null;
        }

        if (compressedTextureOffset > 0) {
            this.compressedTexture = b.slice(compressedTextureOffset, compressedTextureOffset + compressedTextureSize);
        } else {
            this.compressedTexture = null;
        }
    }

    getRGBABuffer() :  Uint8ClampedArray | null {
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
