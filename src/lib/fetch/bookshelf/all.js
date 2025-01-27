import {reviewedStories} from "../../../lib/api.js";
import { fetchCurrentGoodreadsBooks, fetchCurrentFanfictionBooks, fetchCurrentFimfictionBooks } from "./current"
import { fetchFinishedGoodreadsBooks, fetchFinishedFanfictionBooks, fetchFinishedFimfictionBooks } from "./finished"
import { fetchLaterGoodreadsBooks, fetchLaterFanfictionBooks, fetchLaterFimfictionBooks } from "./later"

async function fetchAllBooks(page = 1, pageSize = 10) {
    const reviewedBooksPromise = (await reviewedStories()).reviewedStories;

    // Consolidate all book-fetching operations
    const allBooksPromise = Promise.all([
        fetchCurrentGoodreadsBooks(),
        fetchCurrentFanfictionBooks(),
        fetchCurrentFimfictionBooks(),
        fetchFinishedGoodreadsBooks(),
        fetchFinishedFanfictionBooks(),
        fetchFinishedFimfictionBooks(),
        fetchLaterGoodreadsBooks(),
        fetchLaterFanfictionBooks(),
        fetchLaterFimfictionBooks(),
    ]).then(results => results.flat());

    // Wait for all data to resolve
    const [reviewedBooks, allBooks] = await Promise.all([reviewedBooksPromise, allBooksPromise]);

    // Update statuses and sort
    const sortedBooks = allBooks
        .map(obj => ({
            ...obj,
            status: reviewedBooks.includes(obj.url) ? 'reviewed' : obj.status,
        }))
        .sort((b, a) => new Date(a.added) - new Date(b.added));

    // Paginate the result
    const start = (page - 1) * pageSize;
    const end = page * pageSize;
    return sortedBooks.slice(start, end);
}

export { fetchAllBooks };
