import React from 'react';
import { BookCard } from "./Book.jsx";

export default function Bookshelf({ data }) {
    const { nodes } = data;

    return (
        <>
            <link rel="stylesheet" href="/assets/css/app.css"/>
            <div id={"bookshelf"} className={`min-h-max py-1 mx-auto`}>
                <div className="book-list flex flex-col gap-4">
                    {nodes.map((book, index) => (
                        <BookCard key={index} book={book}/>
                    ))}
                </div>
            </div>
        </>
    );
}
