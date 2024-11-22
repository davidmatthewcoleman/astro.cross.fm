import rss from '@astrojs/rss';
import { getContent } from 'cross:content';

export async function GET(context) {
    const { posts } = await getContent('posts');

    return rss({
        title: 'CROSS’s Blog',
        description: "I'm the adventurer of pixels, the architect of code, and the dreamer behind the keyboard.",
        site: 'https://crossrambles.com',
        xmlns: {
            media: "https://search.yahoo.com/mrss/",
        },
        items: posts.map((post) => {
            const item = {
                title: post.title,
                pubDate: post.date.raw,
                author: 'howdy@crossrambles.com (CROSS)',
                description: post.content.excerpt,
                link: post.path,
            };

            if (post.content.thumbnail) {
                item.customData = `<media:content
                    type="${post.content.thumbnail.mimeType}"
                    width="${post.content.thumbnail.dimensions.width}"
                    height="${post.content.thumbnail.dimensions.height}"
                    medium="image"
                    url="${post.content.thumbnail.source}" />`;
            }

            return item;
        }),
    });
}
