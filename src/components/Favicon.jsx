import React, { useState, useEffect } from 'react';
import Parse from "html-react-parser";
import Picture from "./Picture.jsx";

const Favicon = ({ url, className }) => {
    const [faviconUrl, setFaviconUrl] = useState('');

    useEffect(() => {
        const getFinalUrl = async () => {
            try {
                const response = await fetch(`https://s2.googleusercontent.com/s2/favicons?domain_url=${url}`, { method: 'HEAD', redirect: 'follow' });
                setFaviconUrl(response.url); // The final resolved URL
            } catch (error) {
                console.error('Error fetching the final URL:', error);
            }
        };

        getFinalUrl();
    }, [url]);

    if (!faviconUrl) {
        return null;
    }

    return (
        <>
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
        </>
    );
};

export default Favicon;
