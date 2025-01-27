import { BookCard, BookCardLoader } from "./Book.jsx";
import { useState, useCallback } from "react";
import useSWR from "swr";
import useInfiniteScroll from "react-infinite-scroll-hook";

const fetchBooks = async (url) => {
    const response = await fetch(url, { method: "GET" });
    if (!response.ok) {
        throw new Error("Failed to fetch books");
    }
    return response.json();
};

export default function Bookshelf() {
    const [page, setPage] = useState(1);
    const [bookshelf, setBookshelf] = useState([]);
    const [hasMore, setHasMore] = useState(true);

    // Fetch books using SWR
    const { data, error, isLoading } = useSWR(
        `/api/bookshelf?page=${page}&pageSize=5`, // Adjust `pageSize` as needed
        fetchBooks,
        {
            onSuccess: (newBooks) => {
                if (newBooks.length === 0) {
                    setHasMore(false);
                } else {
                    setBookshelf((prev) => [...prev, ...newBooks]);
                }
            },
        }
    );

    const loadMore = useCallback(() => {
        if (!hasMore) return;
        setPage((prevPage) => prevPage + 1);
    }, [hasMore]);

    const [infiniteRef] = useInfiniteScroll({
        loading: isLoading,
        hasNextPage: hasMore,
        onLoadMore: loadMore,
        disabled: !!error || isLoading,
        rootMargin: "0px 0px 50px 0px",
    });

    if (error) {
        return <div>Error loading books: {error.message}</div>;
    }

    return (
        <div className="tw-app">
            <div id="bookshelf" className="min-h-max py-1 mx-auto">
                <div className="book-list flex flex-col gap-4" ref={infiniteRef}>
                    {bookshelf.map((book, index) => (
                        <BookCard key={index} book={book} />
                    ))}
                    {isLoading && (
                        <>
                            {page === 1 ? (
                                <>
                                    <BookCardLoader />
                                    <BookCardLoader />
                                    <BookCardLoader />
                                </>
                            ) : (
                                <BookCardLoader />
                            )}
                        </>
                    )}
                    {!hasMore && <p className="text-center text-sm mt-0.5 mb-1">end of the line</p>}
                </div>
            </div>
        </div>
    );
}
