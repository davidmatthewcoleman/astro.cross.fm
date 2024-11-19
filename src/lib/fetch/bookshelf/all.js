import { fetchReviewedBooks } from "./reviewed"
import { fetchAllCurrentBooks } from "./current"
import { fetchAllFinishedBooks } from "./finished"
import { fetchAllLaterBooks } from "./later"

async function fetchAllBooks() {
    // Fetch all book data in parallel
    const [reviewedBooks, currentBooks, finishedBooks, laterBooks] = await Promise.all([
        fetchReviewedBooks(),
        fetchAllCurrentBooks(),
        fetchAllFinishedBooks(),
        fetchAllLaterBooks()
    ]);

    // Combine all books into a single array
    let output = [
        ...currentBooks,
        ...finishedBooks,
        ...laterBooks
    ];

    // Update status for reviewed books
    output = output.map(obj => ({
        ...obj,
        status: reviewedBooks.includes(obj.url) ? 'reviewed' : obj.status
    }));

    // Sort books by the .added date
    output.sort((b, a) => new Date(a.added) - new Date(b.added));

    return output;
}

export { fetchAllBooks };
