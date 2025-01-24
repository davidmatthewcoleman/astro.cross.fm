import React, { useState, useEffect, useRef } from "react";

export default function Icon({ name, size = 24, className = '' }) {
    const iconRef = useRef(null);
    const [svgContent, setSvgContent] = useState(null);
    const [forceRender, setForceRender] = useState(0); // State for forcing re-renders

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
                :host {
                    --icon-size: ${size}px;
            
                    display: inline-block;
                    width: var(--icon-size, 24px);
                    height: var(--icon-size, 24px);
                }
                i, svg {
                    display: block;
                    max-width: 100%;
                    aspect-ratio: 1/1;
                }
                ${name === 'spinner' ? 'svg {\n' +
                    '                    animation: spin 1s linear infinite;\n' +
                '                }\n\n' +
                '                @keyframes spin {\n' +
                '                    0% {\n' +
                '                        transform: rotate(0deg);\n' +
                '                    }\n' +
                '                    100% {\n' +
                '                        transform: rotate(360deg);\n' +
                '                    }\n' +
                '                }\n' : ''}
            `;
            shadowRoot.appendChild(styles);
        }
    }, [svgContent, forceRender]);

    const triggerRerender = () => setForceRender(prev => prev + 1);

    if (!svgContent) {
        return null;
    }

    return (
        <inline-icon key={name} ref={iconRef} className={`icon icon__normal icon__${name} ${className}`} width={size} height={size} role="img" />
    );
};

export function Flag({ region, size = 24, className = '', children = null }) {
    const flagRef = useRef(null);
    const [svgContent, setSvgContent] = useState(null);
    const [forceRender, setForceRender] = useState(0); // State for forcing re-renders

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
                :host {
                    --icon-size: ${size}px;
            
                    display: inline-flex;
                    align-items: center;
                    width: var(--icon-size, 24px);
                    height: var(--icon-size, 24px);
                }
                i, svg {
                    display: block;
                    width: 100%;
                    height: min-content;
                    aspect-ratio: 3/2;
                    border-radius: 3px;
                    overflow: hidden;
                }
            `;
            shadowRoot.appendChild(styles);
        }
    }, [svgContent, forceRender]);

    const triggerRerender = () => setForceRender(prev => prev + 1);

    if (!svgContent) {
        return <>{children}</>;
    }

    return (
        <inline-flag key={region} ref={flagRef} className={`icon icon__flag icon__${region} ${className}`} width={size} height={size} role="img" />
    );
};
