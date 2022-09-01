import { Buffer } from 'buffer';

// Add Buffer global if it doesn't exist yet.
if (!window.Buffer) {
    window.Buffer = Buffer;
}

export { Buffer as Buffer };
