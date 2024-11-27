import React, { useState, useEffect, useRef } from "react";

export default function Icon({ name, size = 24, className = '' }) {
    const iconRef = useRef(null);
    const [svgContent, setSvgContent] = useState(null);

    useEffect(() => {
        const loadSvg = async () => {
            try {
                const response = await fetch(`/api/icon/${name}`, {
                    method: "GET"
                });

                const content = await response.json();
                setSvgContent(content.svg);
            } catch (error) {
                console.error(`Error loading SVG for icon "${name}":`, error);
                setSvgContent(null);
            }
        };

        loadSvg();
    }, [name]);

    useEffect(() => {
        const iconElement = iconRef.current;

        // If the shadow root isn't already attached
        if (iconElement && !iconElement.shadowRoot) {
            // Attach the shadow DOM programmatically
            const shadowRoot = iconElement.attachShadow({ mode: "open" });

            // Parse the SVG content and append it to the shadow root
            const wrapper = document.createElement("i");
            wrapper.innerHTML = svgContent; // Ensure svgContent is raw HTML/SVG
            shadowRoot.appendChild(wrapper);

            const styles = document.createElement('style');
            styles.innerHTML = `
                i, svg {
                    display: block;
                    max-width: 100%;
                    aspect-ratio: 1/1;
                }
            `;
            shadowRoot.appendChild(styles);
        }
    }, [svgContent]);

    if (!svgContent) {
        return null;
    }

    return (
        <inline-icon ref={iconRef} className={`icon icon__normal ${className}`} width={size} height={size} style={{ width: `${size}px`, height: `${size}px` }} role="img" />
    );
};

export function Flag({ region, size = 24, className = '', children = null }) {
    const flagRef = useRef(null);
    const [svgContent, setSvgContent] = useState(null);

    useEffect(() => {
        const loadSvg = async () => {
            try {
                const response = await fetch(`/api/flag/${region}`, {
                    method: "GET"
                });

                const content = await response.json();
                setSvgContent(content.svg);
            } catch (error) {
                console.error(`Error loading SVG for region "${region}":`, error);
                setSvgContent(null);
            }
        };

        loadSvg();
    }, [region]);

    useEffect(() => {
        const flagElement = flagRef.current;

        // If the shadow root isn't already attached
        if (flagElement && !flagElement.shadowRoot) {
            // Attach the shadow DOM programmatically
            const shadowRoot = flagElement.attachShadow({ mode: "open" });

            // Parse the SVG content and append it to the shadow root
            const wrapper = document.createElement("i");
            wrapper.innerHTML = svgContent; // Ensure svgContent is raw HTML/SVG
            shadowRoot.appendChild(wrapper);

            const styles = document.createElement('style');
            styles.innerHTML = `
                i, svg {
                    display: block;
                    max-width: 100%;
                    aspect-ratio: 3/2;
                }
            `;
            shadowRoot.appendChild(styles);
        }
    }, [svgContent]);

    if (!svgContent) {
        return <>{children}</>;
    }

    return (
        <inline-flag ref={flagRef} className={`icon icon__flag ${className}`} width={size} height={size} style={{ width: `${size}px`, height: `${size}px` }} role="img" />
    );
};
