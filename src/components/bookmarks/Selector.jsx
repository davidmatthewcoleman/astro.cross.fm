import { useEffect, useState } from "react";
import Parse from "html-react-parser";

export default function CollectionSelector() {
    const [collections, setCollections] = useState([]);
    const [defaultCollection, setDefaultCollection] = useState(null);
    const [currentCollection, setCurrentCollection] = useState(null);
    const [currentWidth, setCurrentWidth] = useState(0);
    const [initialized, setInitialized] = useState(false);

    useEffect(() => {
        if (window.location.hash && window.location.hash.length) {
            setDefaultCollection(window.location.hash.slice(1));
        }
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/api/bookmarks/listCollections', {
                    method: "GET",
                });
                const data = await response.json();
                const output = [];

                for (const item of data.collections) {
                    const response = await fetch(`/api/bookmarks/getCollection?id=${item}`, {
                        method: "GET",
                    });
                    const { item: col } = await response.json();

                    output.push({
                        id: col._id,
                        title: col.title,
                        slug: col.slug,
                    });
                }

                setCollections(output);

                // Initialize current collection without triggering the handleChange
                const initialCollection = defaultCollection || output[0]?.id;
                setCurrentCollection(initialCollection);
                setInitialized(true); // Mark as initialized
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [defaultCollection]);

    useEffect(() => {
        if (initialized) {
            history.replaceState(null, '', `#${currentCollection}`);
        }
    }, [currentCollection, initialized]);

    useEffect(() => {
        // Define your custom event
        const customEvent = new CustomEvent('collectionChanged', {
            detail: { message: 'Changed Collection!', timestamp: Date.now() },
        });

        // Dispatch the custom event
        window.dispatchEvent(customEvent);
    }, [currentCollection]);

    useEffect(() => {
        // Define your custom event
        const customEvent = new CustomEvent('collectionInit', {
            detail: { message: 'Set Collection!', timestamp: Date.now() },
        });

        // Dispatch the custom event
        window.dispatchEvent(customEvent);
    }, [initialized]);

    useEffect(() => {
        // Create the function to update the width
        const updateWidth = () => {
            const select = document.getElementById("select-collection");
            const o = select.options[select.selectedIndex];
            const s = document.createElement('span');

            s.textContent = o.textContent;

            const ostyles = getComputedStyle(select);
            s.style.fontFamily = ostyles.fontFamily;
            s.style.fontStyle = ostyles.fontStyle;
            s.style.fontWeight = ostyles.fontWeight;
            s.style.fontSize = ostyles.fontSize;


            document.body.appendChild(s);

            setCurrentWidth(s.offsetWidth + 0);


            document.body.removeChild(s);
        };

        // Use setTimeout to delay the execution of the width calculation
        const timeoutId = setTimeout(updateWidth, 0);

        // Return a cleanup function to clear the timeout when the component is unmounted or the effect reruns
        return () => {
            clearTimeout(timeoutId);
        };
    }, [currentCollection]); // Dependency on currentCollection ensures it runs whenever it changes

    if (!collections.length) {
        return null;
    }

    const handleChange = (event) => {
        const value = event.target.value;
        setCurrentCollection(value);
    };

    return (
        <select id="select-collection" value={currentCollection || ''} onChange={handleChange} style={{ '--width': `${currentWidth}px` }}>
            {collections.map(({ id, title, slug }) => (
                <option key={id} value={id}>
                    {Parse(title)}
                </option>
            ))}
        </select>
    );
}