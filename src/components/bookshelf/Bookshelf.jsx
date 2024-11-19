import { BookCard, BookCardLoader } from "./Book.jsx";
import { useEffect, useState } from "react";

export default function Bookshelf() {
    const [bookshelf, setBookshelf] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/api/bookshelf', {
                    method: "GET"
                });
                const data = await response.json();
                setBookshelf(data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    if (!bookshelf) {
        return (
            <div className={"tw-app"}>
                <div id={"bookshelf"} className={`min-h-max py-1 mx-auto`}>
                    <div className="book-list flex flex-col gap-4">
                        <BookCardLoader />
                        <BookCardLoader />
                        <BookCardLoader />
                        <BookCardLoader />
                        <BookCardLoader />
                        <BookCardLoader />
                        <BookCardLoader />
                        <BookCardLoader />
                        <BookCardLoader />
                        <BookCardLoader />
                        <BookCardLoader />
                        <BookCardLoader />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={"tw-app"}>
            <div id={"bookshelf"} className={`min-h-max py-1 mx-auto`}>
                <div className="book-list flex flex-col gap-4">
                    {bookshelf.map((book, index) => (
                        <>
                            <BookCardLoader />
                            <BookCard key={index} book={book}/>
                        </>
                    ))}
                </div>
            </div>
        </div>
    );
}
