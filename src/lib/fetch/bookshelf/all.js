import { fetchReviewedBooks } from "./reviewed"
import { fetchCurrentGoodreadsBooks, fetchCurrentFanfictionBooks, fetchCurrentFimfictionBooks } from "./current"
import { fetchFinishedGoodreadsBooks, fetchFinishedFanfictionBooks, fetchFinishedFimfictionBooks } from "./finished"
import { fetchLaterGoodreadsBooks, fetchLaterFanfictionBooks, fetchLaterFimfictionBooks } from "./later"

async function fetchAllBooks() {
    const reviewedBooksPromise = fetchReviewedBooks();

    // Consolidate all book-fetching operations into one
    const allBooksPromise = Promise.all([
        fetchCurrentGoodreadsBooks(),
        fetchCurrentFanfictionBooks(),
        fetchCurrentFimfictionBooks(),
        fetchFinishedGoodreadsBooks(),
        fetchFinishedFanfictionBooks(),
        fetchFinishedFimfictionBooks(),
        fetchLaterGoodreadsBooks(),
        fetchLaterFanfictionBooks(),
        fetchLaterFimfictionBooks()
    ]).then(results => results.flat());

    // Wait for all data to resolve
    const [reviewedBooks, allBooks] = await Promise.all([reviewedBooksPromise, allBooksPromise]);

    // Update statuses and sort
    const output = allBooks
        .map(obj => ({
            ...obj,
            status: reviewedBooks.includes(obj.url) ? 'reviewed' : obj.status
        }))
        .sort((b, a) => new Date(a.added) - new Date(b.added));

    return output;
}

export { fetchAllBooks };
