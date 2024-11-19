import Parser from "rss-parser";
import NodeCache from "node-cache";
const GOODREADS_KEY = import.meta.env.GOODREADS_KEY;
const profile = '162552693';

const parser = new Parser({
    customFields: {
        item: ['book_id', 'book_large_image_url', 'author_name', 'user_date_added', 'pubDate', 'book_description']
    }
});

const cache = new NodeCache({ stdTTL: 3600 });

async function fetchGoodreads(shelf) {
    const cacheKey = `goodreads_bookshelf_${shelf}`;
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
        return JSON.parse(cachedData);
    }

    const feed = await parser.parseURL(`https://www.goodreads.com/review/list_rss/${profile}?key=${GOODREADS_KEY}&shelf=${shelf}`);

    const output = [];

    for (const book of feed.items) {
        const books = {
            id: book.book_id,
            title: book.title.replace(/\s*\(.*?\)\s*/g, " ").trim(),
            imageURL: book.book_large_image_url,
            author: book.author_name.trim(),
            dateAdded: book.user_date_added,
            datePublished: book.pubDate,
            description: stripTagsExceptNewlines(book.book_description)
        }

        output.push(books);
    }

    cache.set(cacheKey, JSON.stringify(output));

    return output;
}

function stripTagsExceptNewlines(html) {
    // Replace <br> and <br/> with newline characters
    html = html.replace(/<br\s*\/?>/gi, '\n');
    // Remove all other HTML tags
    html = html.replace(/<[^>]+>/g, '');
    return html;
}

export { fetchGoodreads };