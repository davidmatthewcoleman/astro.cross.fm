export function fetchPicture(data, remote = false) {
    const baseDomain = remote ? 'images.cross.fm' : 'images.cross.fm';

    const newSrcSets = {};

    for (const [mediaQuery, { media, params }] of Object.entries(data)) {
        if (!media || !params) {
            console.error(`Missing 'media' or 'params' object for '${mediaQuery}'`);
            continue;
        }

        const { sourceFile, sourceUrl, mediaDetails } = media;
        if (!sourceFile && !sourceUrl) {
            console.error(`Neither 'sourceFile' nor 'sourceUrl' provided for '${mediaQuery}'`);
            continue;
        }

        const imageUrl = sourceFile || sourceUrl;
        const transformParams = {
            width: params.width,
            height: params.height || null,
            gravity: `${mediaDetails.x}x${mediaDetails.y}`,
            ...params // Include any additional params directly from input, allowing for custom transformations
        };

        // Construct Cloudflare image transformation parameters string
        const paramStr = Object.entries(transformParams).map(([key, value]) => `${key}=${value}`).join(',');

        const baseImgSrc = `https://${baseDomain}/${paramStr}/${imageUrl}`;

        const avifSrcset = {};
        const webpSrcset = {};

        for (let i = 1; i <= 3; i++) {
            avifSrcset[i + "x"] = `https://${baseDomain}/format=avif,dpr=${i},${paramStr}/${imageUrl}`;
            webpSrcset[i + "x"] = `https://${baseDomain}/format=webp,dpr=${i},${paramStr}/${imageUrl}`;
        }

        newSrcSets[mediaQuery] = {
            img: baseImgSrc,
            srcset: {
                avif: avifSrcset,
                webp: webpSrcset,
            },
        };
    }

    return newSrcSets;
}
