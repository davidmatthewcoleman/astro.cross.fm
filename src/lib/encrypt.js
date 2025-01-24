import NodeCache from 'node-cache';
let createCipheriv;
if (import.meta.env.SSR) {
    createCipheriv = (await import('crypto')).createCipheriv;
}

const encryptionKey = import.meta.env.TWICPICS_ENCRYPTION_KEY;

// Create an instance of NodeCache (TTL can be customized)
const cache = new NodeCache({ stdTTL: Number(30 * 24 * 60 * 60), checkperiod: 60 });

export default function UseEncryptedImage(url) {
    url = /^https?:\/\//.test(url) ? url : `${import.meta.env.IMAGE_STORAGE}/${url}`;

    // Check if the URL has already been encrypted and cached
    const cachedUrl = cache.get(url);
    if (cachedUrl) {
        // console.log('URL found in cache:', cachedUrl);
        return cachedUrl; // Return the cached encrypted URL
    }

    // Reverses the URL
    const reversed = url.split('').reverse().join('');

    // Ensure the encryption key is 16 bytes long (for aes-128-ecb)
    const keyBuffer = Buffer.from(encryptionKey, 'base64');
    if (keyBuffer.length !== 16) {
        throw new Error('Encryption key must be 16 bytes long');
    }

    // Encrypt the reversed URL
    const encryptor = createCipheriv('aes-128-ecb', keyBuffer, null);

    const encrypted = Buffer.concat([
        encryptor.update(Buffer.from(reversed)),
        encryptor.final(),
    ]);

    // Encode the encrypted result to Base64
    const encoded = encrypted.toString('base64');

    // Replace slashes by dashes in the encoded string
    const withoutSlashes = encoded.replaceAll('/', '-');

    // Cache the encrypted URL
    cache.set(url, withoutSlashes);

    // console.log('URL encrypted and cached successfully:', withoutSlashes);

    return withoutSlashes;
}

export function BuildURL(src, params, dpr = 1) {
    // Clone params to avoid mutation
    const clonedParams = { ...params };

    // Format focus
    if (clonedParams?.focus && typeof clonedParams.focus === "object") {
        clonedParams.focus = `${Math.round(clonedParams.focus.x * 100)}px${Math.round(clonedParams.focus.y * 100)}p`;
    }

    // Format cover
    if (clonedParams?.cover && Array.isArray(clonedParams.cover)) {
        clonedParams.cover = clonedParams.cover
            .map((val) => (convertValue(val) === "auto" ? "-" : convertValue(val) * dpr))
            .join("x");
    }

    // Format resize
    if (clonedParams?.resize && Array.isArray(clonedParams.resize)) {
        clonedParams.resize = clonedParams.resize
            .map((val) => (convertValue(val) === "auto" ? "-" : convertValue(val) * dpr))
            .join("x");
    }

    // Build transformation string
    const transforms = Object.keys(clonedParams)
        .map((prop) => `${prop.replace(/([a-z])([A-Z])/g, (_, lower, upper) => `${lower}-${upper.toLowerCase()}`)}=${clonedParams[prop]}`)
        .join("/");

    const encryptedSource = UseEncryptedImage(src);

    // Construct the full URL
    return `${import.meta.env.PUBLIC_TWICPICS_DOMAIN}/${encryptedSource}?v1/${transforms}`;
}

export function convertValue(value) {
    return value === "auto" || value === null || value === undefined ? "auto" : parseInt(value, 10);
}