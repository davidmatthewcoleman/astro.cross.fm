import { useEffect, useState } from "react";

export default function AboutSelector({about}) {
    const [currentPage, setCurrentPage] = useState(about ? '/about' : '/about/interests');
    const [currentWidth, setCurrentWidth] = useState(0);
    const [initialized, setInitialized] = useState(false);

    useEffect(() => {
        const page = window.location.pathname.split('/').slice(-1).pop();
        setCurrentPage(`/about/${page === 'about' ? '' : page}`);
        setInitialized(true);
    }, [])

    useEffect(() => {
        // Create the function to update the width
        const updateWidth = () => {
            const select = document.getElementById("select-page");
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
    }, [currentPage]); // Dependency on currentCollection ensures it runs whenever it changes

    const handleChange = (event) => {
        const value = event.target.value;
        window.location.href = value;
    };

    return (
        <select id="select-page" value={currentPage} onChange={handleChange}
                style={{'--width': `${currentWidth}px`}}>
            {about && (
                <option key={0} value={'/about'}>
                    About Me
                </option>
            )}
            <option key={1} value={'/about/interests'}>
                My Interests
            </option>
            <option key={2} value={'/about/bookmarks'}>
                Bookmarks
            </option>
            <option key={3} value={'/about/bookshelf'}>
                Bookshelf
            </option>
            <option key={4} value={'/about/things'}>
                Things
            </option>
        </select>
    );
}