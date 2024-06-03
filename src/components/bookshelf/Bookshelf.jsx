import React, { useState } from 'react';
import { BookGrid, BookCard } from "./Book.jsx";

export default function Bookshelf({ data, defaultView = 'list' }) {
    const { nodes } = data;
    const [view, setView] = useState(defaultView);

    const toggleView = () => {
        setView(prevView => prevView === 'grid' ? 'list' : 'grid');
    };

    return (
        <>
            <link rel="stylesheet" href="/assets/css/app.css"/>
            <div id={"bookshelf"} className={`min-h-max py-1 mx-auto`}>
                <div className="flex justify-end absolute inset-x-0 top-0 h-10">
                    <button id="toggleButton" onClick={toggleView} className="text-xl underline font-mono text-[#F68C36] hover:text-[#D3C200] no-underline hover:underline">
                        Toggle View
                    </button>
                </div>
                {view === 'grid' && (
                    <div
                        className={`book-grid columns-1 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-3 gap-4 pointer-events-none`}>
                        {nodes.map((book, index) => (
                            <BookGrid key={index} book={book}/>
                        ))}
                    </div>
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
