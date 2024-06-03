import ImgixClient from "@imgix/js-core";
import { IMGIX_HOST_DOMAIN, IMGIX_SECURE_TOKEN, IMGIX_REMOTE_HOST_DOMAIN, IMGIX_REMOTE_SECURE_TOKEN } from "../../config.js";

export function fetchPicture(data) {
    const isRemote = !data.sourceFile;
    const opts = {
        domain: isRemote ? IMGIX_REMOTE_HOST_DOMAIN : IMGIX_HOST_DOMAIN,
        secureURLToken: isRemote ? IMGIX_REMOTE_SECURE_TOKEN : IMGIX_SECURE_TOKEN,
        includeLibraryParam: false,
    };

    const client = new ImgixClient(opts);

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

        const baseImgSrc = client.buildURL(sourceFile || sourceUrl, {
            w: params.width,
            h: params.height,
            "fp-x": mediaDetails.x,
            "fp-y": mediaDetails.y,
            ...params
        });

        const avifSrcset = {};
        const webpSrcset = {};

        for (let i = 1; i <= 3; i++) {
            const dprSrc = client.buildURL(sourceFile || sourceUrl, {
                ...params,
                "fp-x": mediaDetails.x,
                "fp-y": mediaDetails.y,
                fm: "avif", // Set format to AVIF
                dpr: i // Set device pixel ratio
            });
            avifSrcset[i + "x"] = dprSrc;

            const webpDprSrc = client.buildURL(sourceFile || sourceUrl, {
                ...params,
                "fp-x": mediaDetails.x,
                "fp-y": mediaDetails.y,
                fm: "webp", // Set format to WebP
                dpr: i, // Set device pixel ratio
            });
            webpSrcset[i + "x"] = webpDprSrc;
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
