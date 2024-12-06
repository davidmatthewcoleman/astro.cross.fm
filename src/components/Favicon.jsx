import React, { useState, useEffect } from 'react';
import Parse from "html-react-parser";
import Picture from "./Picture.jsx";

const Favicon = ({ url, className }) => {
    const [faviconUrl, setFaviconUrl] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!url) return;

        const fetchFavicon = async () => {
            try {
                // Fetch the HTML of the page
                const response = await fetch(url);
                const html = await response.text();

                // Parse the HTML to extract the favicon
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');

                // Look for <link rel="icon"> or <link rel="shortcut icon">
                const iconLink =
                    doc.querySelector('link[rel="icon"]') ||
                    doc.querySelector('link[rel="shortcut icon"]');

                if (iconLink) {
                    let faviconHref = iconLink.getAttribute('href');

                    // Resolve relative paths
                    if (!faviconHref.startsWith('http')) {
                        const base = new URL(url).origin;
                        faviconHref = new URL(faviconHref, base).href;
                    }

                    setFaviconUrl(faviconHref);
                } else {
                    setError('No favicon found.');
                }
            } catch (err) {
                setError('Failed to fetch favicon.');
                console.error(err);
            }
        };

        fetchFavicon();
    }, [url]);

    if (!faviconUrl) {
        return null;
    }

    return (
        <>
            {faviconUrl && (
                <Picture
                    remote={true}
                    alt={Parse(new URL(url).hostname)}
                    className={className}
                    source={
                        {
                            null: {
                                media: {
                                    filename: new URL(faviconUrl).pathname,
                                    source: faviconUrl,
                                    dominantColor: null,
                                    dimensions: {
                                        width: 32,
                                        height: 32
                                    },
                                    focalPoint: {
                                        x: 0.5,
                                        y: 0.5
                                    }
                                },
                                params: {
                                    'width': 14,
                                    'height': 14
                                }
                            }
                        }
                    }
                />
            )}
        </>
    );
};

export default Favicon;
