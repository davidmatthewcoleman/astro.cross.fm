import React, { useEffect, useState } from 'react';
import { BookCard } from "./Book.jsx";

export default function Bookshelf() {
    const [bookshelf, setBookshelf] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`/api/bookshelf`, {
                    method: 'GET'
                });
                const data = await response.json();
                setBookshelf(data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    console.log('bookshelfData?:', bookshelf);

    if (!bookshelf) {
        return null; // Or a loading spinner
    }

    return (
        <>
            <link rel="stylesheet" href="/assets/css/app.css"/>
            <div id={"bookshelf"} className={`min-h-max py-1 mx-auto`}>
                <div className="book-list flex flex-col gap-4">
                    {bookshelf.map((book, index) => (
                        <BookCard key={index} book={book}/>
                    ))}
                </div>
            </div>
        </>
    );
}
