import { BookCard } from "./Book.jsx";
import { bookshelfQuery } from "../../lib/api.js";

export default async function Bookshelf() {
    const bookshelf = await bookshelfQuery();

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
