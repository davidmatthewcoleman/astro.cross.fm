import React, { useState, useEffect, useRef } from "react";
import Parse from "html-react-parser";

const Flag = ({ region, size, children }) => {
    const flagRef = useRef(null);
    const [svgContent, setSvgContent] = useState(null);

    // Import all SVGs as raw strings from src/assets/flags/
    const svgFiles = import.meta.glob('../assets/flags/*.svg', { as: 'raw' });

    useEffect(() => {
        const loadSvg = async () => {
            try {
                const importFn = svgFiles[`../assets/flags/${region}.svg`];  // Adjusted path
                if (!importFn) {
                    console.error(`SVG for region "${region}" not found.`);
                    setSvgContent(null);
                    return;
                }

                const content = await importFn(); // Load the SVG content
                setSvgContent(content);
            } catch (error) {
                console.error(`Error loading SVG for region "${region}":`, error);
                setSvgContent(null);
            }
        };

        loadSvg();
    }, [region, svgFiles]);

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
            styles.innerText = `
                i {
                    display: inline-block;
                    max-width: 100%;
                    aspect-ratio: 3/2;
                }
                svg {
                    display: block;
                    max-width: 100%;
                }
            `;
            shadowRoot.appendChild(styles);
        }
    }, [svgContent]);

    if (!svgContent) {
        return <>{children}</>;
    }

    return (
        <inline-flag ref={flagRef} className="icon flag" style={{ width: size, height: size }} role="img" />
    );
};

export default Flag;
