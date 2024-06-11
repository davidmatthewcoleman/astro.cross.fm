import React, { useState, useEffect } from 'react';
import { BookGrid, BookCard } from "./Book.jsx";

export default function Bookshelf({ data, defaultView = 'list' }) {
    const { nodes } = data;

    // Check if default view is in localStorage, otherwise fallback to defaultView prop
    const storedView = localStorage.getItem('view');
    const [view, setView] = useState(storedView || defaultView);

    // Update local storage when view changes
    const toggleView = () => {
        const newView = view === 'grid' ? 'list' : 'grid';
        setView(newView);
        localStorage.setItem('view', newView);
    };

    useEffect(() => {
        // Ensure that view in localStorage stays synced with view state
        localStorage.setItem('view', view);
    }, [view]);

    return (
        <>
            <link rel="stylesheet" href="/assets/css/app.css"/>
            <div id={"bookshelf"} className={`initial-hide hidden min-h-max py-1 mx-auto`} style={{ display: 'none' }}>
                <div className="flex justify-end absolute inset-x-0 top-0 h-10">
                    {/*<button id="toggleButton" onClick={toggleView} className="text-xl underline font-mono text-[#F68C36] hover:text-[#D3C200] no-underline hover:underline">*/}
                    {/*    Toggle View*/}
                    {/*</button>*/}
                </div>
                {view === 'grid' && (
                    <></>
                    // <div
                    //     className={`book-grid columns-1 sm:columns-2 md:columns-3 lg:columns-3 gap-4 pointer-events-none`}>
                    //     {nodes.map((book, index) => (
                    //         <BookGrid key={index} book={book}/>
                    //     ))}
                    // </div>
                )}
                {view === 'list' && (
                    <div className="book-list flex flex-col gap-4">
                        {nodes.map((book, index) => (
                            <BookCard key={index} book={book}/>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}
