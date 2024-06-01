import ImgixClient from "@imgix/js-core";

export async function fetchPicture(data) {
    const client = new ImgixClient({
        domain: import.meta.env.IMGIX_HOST_DOMAIN,
        secureURLToken: import.meta.env.IMGIX_SECURE_TOKEN,
        includeLibraryParam: false,
    });

    const newSrcSets = {};

    for (const [mediaQuery, { media, params }] of Object.entries(data)) {
        if (!media || !params) {
            console.error(`Missing 'media' or 'params' object for '${mediaQuery}'`);
            continue;
        }

        const { sourceFile, mediaDetails } = media;

        if (!sourceFile || !mediaDetails) {
            console.error(`Missing 'sourceFile' or 'mediaDetails' property for '${mediaQuery}'`);
            continue;
        }

        // Construct the base URL without format or dpr parameters
        const baseImgSrc = client.buildURL(sourceFile, {
            w: params.width.toString(),
            h: params.height.toString(),
            "fp-x": mediaDetails.x,
            "fp-y": mediaDetails.y,
            ...params
        });

        // Construct srcset values for AVIF format
        const avifSrcset = {};
        for (let i = 1; i <= 3; i++) {
            const dprSrc = client.buildURL(sourceFile, {
                ...params,
                "fp-x": mediaDetails.x,
                "fp-y": mediaDetails.y,
                fm: "avif", // Set format to AVIF
                dpr: i.toString(), // Set device pixel ratio
            });
            avifSrcset[i.toString() + "x"] = dprSrc;
        }

        // Construct srcset values for WebP format
        const webpSrcset = {};
        for (let i = 1; i <= 3; i++) {
            const dprSrc = client.buildURL(sourceFile, {
                ...params,
                "fp-x": mediaDetails.x,
                "fp-y": mediaDetails.y,
                fm: "webp", // Set format to WebP
                dpr: i.toString(), // Set device pixel ratio
            });
            webpSrcset[i.toString() + "x"] = dprSrc;
        }

        // Construct the desired structure with the signed image URLs and srcset values
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
