import { useEffect, useState } from "react";
import Parse from "html-react-parser";

export default function ChapterSelector({story, defaultChapter, children}) {
    const [chapters, setChapters] = useState([]);
    const [currentChapter, setCurrentChapter] = useState(null);
    const [currentWidth, setCurrentWidth] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`/api/chapters/${story}`, { method: "GET" });
                const data = await response.json();
                setChapters(data);

                // Respect defaultChapter if provided
                const initialChapter = defaultChapter !== undefined ? defaultChapter : data[0]?.path;
                setCurrentChapter(initialChapter);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [story, defaultChapter]); // Include `story` and `defaultChapter` as dependencies

    useEffect(() => {
        // Create the function to update the width
        const updateWidth = () => {
            const select = document.getElementById("select-chapter");
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
    }, [currentChapter]); // Dependency on currentCollection ensures it runs whenever it changes

    if (!chapters.length) {
        return (
            <>
                {children}
            </>
        );
    }

    const handleChange = (event) => {
        const value = event.target.value;
        setCurrentChapter(value);

        window.location.href = value;
    };

    return (
        <select id="select-chapter" value={currentChapter || defaultChapter} onChange={handleChange} style={{ '--width': `${currentWidth}px` }}>
            {chapters.map(({ title, slug, path }) => (
                <option key={slug} value={path}>
                    {Parse(title)}
                </option>
            ))}
        </select>
    );
}