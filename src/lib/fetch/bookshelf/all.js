import { fetchReviewedBooks } from "./reviewed"
import { fetchAllCurrentBooks } from "./current"
import { fetchAllFinishedBooks } from "./finished"
import { fetchAllLaterBooks } from "./later"

async function fetchAllBooks() {
    const reviewedBooks = await fetchReviewedBooks()
    const currentBooks = await fetchAllCurrentBooks();
    const finishedBooks = await fetchAllFinishedBooks();
    const laterBooks = await fetchAllLaterBooks();

    // Combine all books into a single array
    let output = [
        ...currentBooks,
        ...finishedBooks,
        ...laterBooks
    ];

    output = output.map(obj => ({
        ...obj,
        status: reviewedBooks.some(item => item === obj.url) ? 'reviwed' : obj.status
    }));

    // Sort books by title
    output.sort((b, a) => new Date(a.added) - new Date(b.added));

    return output;
}

export { fetchAllBooks };