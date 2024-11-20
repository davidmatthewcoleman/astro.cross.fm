import { fetchRaindropData } from '../raindrop';
import { fetchFanfictionData } from '../fanfiction';
import {fetchFimfictionUserData, fetchFimfictionBookshelfData, fetchFimfictionStoryData} from '../fimfiction';
import {fetchGoodreads} from "../goodreads";

async function fetchLaterGoodreadsBooks() {
    const books = await fetchGoodreads('to-read');
    const output = [];

    for (const book of books) {
        output.push({
            id: book.id,
            title: book.title,
            description: book.description,
            link: `https://www.goodreads.com/book/show/${book.id}`,
            url: `https://www.goodreads.com/book/show/${book.id}`,
            author: book.author,
            cover: {
                sourceUrl: book.imageURL,
                mediaDetails: {
                    width: 128,
                    height: 128,
                    x: 0.5,
                    y: 0.5,
                    color: null
                },
            },
            added: new Date(book.dateAdded).toISOString(),
            published: new Date(book.datePublished).toISOString(),
            site: {
                domain: 'goodreads.com',
                icon: {
                    sourceUrl: 'https://www.goodreads.com/favicon.ico',
                    mediaDetails: {
                        width: 18,
                        height: 18,
                        x: 0.5,
                        y: 0.5,
                        color: null
                    },
                }
            },
            status: false
        });
    }

    return output;
}

async function fetchLaterFanfictionBooks() {
    const data = await fetchRaindropData('45127383');
    const output = [];

    for (const book of data.items) {
        const bookData = await fetchFanfictionData(book.link);
        const cover = bookData.thumbnail.replace('/75', '/180');

        output.push({
            id: bookData.id,
            title: bookData.title,
            description: bookData.excerpt.replace(/<[^>]+>/g, ''),
            link: bookData.source,
            url: bookData.source,
            author: bookData.author,
            cover: {
                sourceUrl: cover,
                mediaDetails: {
                    width: 128,
                    height: 128,
                    x: 0.5,
                    y: 0.5,
                    color: null
                },
            },
            added: new Date(book.created).toISOString(),
            published: new Date(bookData.date * 1000).toISOString(),
            site: {
                domain: 'fanfiction.net',
                icon: {
                    sourceUrl: 'https://i.ibb.co/w0ZLW8s/ff-icon-180.png',
                    mediaDetails: {
                        width: 18,
                        height: 18,
                        x: 0.5,
                        y: 0.5,
                        color: null
                    },
                }
            },
            status: false
        });
    }
    return output;
}

async function fetchLaterFimfictionBooks() {
    const { data } = await fetchFimfictionBookshelfData('https://www.fimfiction.net/bookshelf/953799/reading-list-for-blog');
    const output = [];

    for (const book of data) {
        const story = (await fetchFimfictionStoryData(book.relationships.story.data.id)).data;
        const author = (await fetchFimfictionUserData(story.relationships.author.data.id)).data;
        const cover = story.attributes.cover_image.full;

        output.push({
            id: story.id,
            title: story.attributes.title,
            description: story.attributes.short_description.replace(/<[^>]+>/g, ''),
            link: story.meta.url,
            url: story.meta.url,
            author: author.attributes.name,
            cover: {
                sourceUrl: cover,
                mediaDetails: {
                    width: 128,
                    height: 128,
                    x: 0.5,
                    y: 0.5,
                    color: null
                },
            },
            added: new Date(book.attributes.date_added).toISOString(),
            published: new Date(story.attributes.date_published).toISOString(),
            site: {
                domain: 'fimfiction.net',
                icon: {
                    sourceUrl: 'https://static.fimfiction.net/images/favicon.png',
                    mediaDetails: {
                        width: 18,
                        height: 18,
                        x: 0.5,
                        y: 0.5,
                        color: null
                    },
                }
            },
            status: false
        });
    }
    return output;
}

async function fetchAllLaterBooks() {
    // Fetch all book data in parallel
    const [goodreadsBooks, fanfictionBooks, fimfictionBooks] = await Promise.all([
        fetchLaterGoodreadsBooks(),
        fetchLaterFanfictionBooks(),
        fetchLaterFimfictionBooks()
    ]);

    // Combine all books into a single array
    let output = [
        ...goodreadsBooks,
        ...fanfictionBooks,
        ...fimfictionBooks
    ];

    // Sort books by .added date
    output.sort((b, a) => new Date(a.added) - new Date(b.added));

    // Return the top 12 books
    return output;
}

export { fetchLaterGoodreadsBooks, fetchLaterFimfictionBooks, fetchLaterFanfictionBooks, fetchAllLaterBooks };
