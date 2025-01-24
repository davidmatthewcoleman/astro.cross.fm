import React, { useEffect, useState } from "react";

export default function Picture({ source = [], alt = null, className = null, classNamePicture = null, color = null, ...rest }) {
    const [encryptedSource, setEncryptedSource] = useState(null);
    // Build fallback source
    const fallback = source[0];

    // Render loading state while encrypted sources are being fetched
    if (!fallback.url) {
        return;
    }

    useEffect(() => {
        // Fetch encrypted URLs for all sources
        const fetchEncryptedSource = async () => {
            const encrypted = await fetch(`/api/encryptImage?src=${encodeURIComponent(fallback.url)}`, { method: "GET" })
                .then((res) => res.json())
                .then((data) => data.data);

            setEncryptedSource(encrypted);
        };

        fetchEncryptedSource();
    }, [source]);

    const fallbackSrc = BuildURL(encryptedSource, { ...fallback.params, output: "png" }, 1);
    const size = fallback.params?.cover || fallback.params?.resize;

    // Resolve all source sets (avif and webp)
    const resolvedSources = source.map(({ media, params }, index) => {
        // const encryptedSource = encryptedSources[index];
        const avifSet = [1, 2, 3]
            .map((dpr) => `${BuildURL(encryptedSource, { ...params, output: "avif" }, dpr)} ${dpr}x`)
            .join(", ");

        const webpSet = [1, 2, 3]
            .map((dpr) => `${BuildURL(encryptedSource, { ...params, output: "webp" }, dpr)} ${dpr}x`)
            .join(", ");

        return { media, avif: avifSet, webp: webpSet };
    });

    return (
        <picture className={classNamePicture}>
            {resolvedSources.map(({ media, avif, webp }, index) => (
                <React.Fragment key={index}>
                    <source type="image/avif" media={media} srcSet={avif} />
                    <source type="image/webp" media={media} srcSet={webp} />
                </React.Fragment>
            ))}
            <img
                src={fallbackSrc}
                alt={alt || ""}
                className={`${className} ${fallbackSrc ? "" : "opacity-0"} transition-all duration-500 text-transparent bg-background`}
                width={convertValue(size[0])}
                height={convertValue(size[1])}
                {...rest}
            />
        </picture>
    );
}

// Pure function for building URL with params
function BuildURL(src, params, dpr = 1) {
    const clonedParams = { ...params };

    // Format focus
    if (clonedParams?.focus && typeof clonedParams?.focus === "object") {
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

    const sortedParams = sortObjectByCustomOrder(clonedParams, ['focus', 'resize', 'cover', 'output']);

    // Build transformation string
    const transforms = Object.keys(sortedParams)
        .map((prop) => `${prop.replace(/([a-z])([A-Z])/g, (_, lower, upper) => `${lower}-${upper.toLowerCase()}`)}=${clonedParams[prop]}`)
        .join("/");

    return `${import.meta.env.PUBLIC_TWICPICS_DOMAIN}/${src}?v1/${transforms}`;
}

function convertValue(value) {
    return value === "auto" || value === null || value === undefined ? "auto" : parseInt(value, 10);
}

function sortObjectByCustomOrder(obj, keyOrder) {
    return keyOrder.reduce((sortedObj, key) => {
        if (key in obj) {
            sortedObj[key] = obj[key];
        }
        return sortedObj;
    }, {});
}