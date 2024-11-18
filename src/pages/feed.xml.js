import rss from '@astrojs/rss';
import { blogQuery } from '../lib/api.js';

export async function GET(context) {
    const data = await blogQuery(9999);
    const posts = data.posts.edges;

    return rss({
        title: 'CROSS’s Blog',
        description: "I'm the adventurer of pixels, the architect of code, and the dreamer behind the keyboard.",
        site: 'https://crossrambles.com',
        xmlns: {
            media: "http://search.yahoo.com/mrss/",
        },
        items: posts.map(({ node: post }) => {
            const item = {
                title: post.title,
                pubDate: post.date,
                author: 'howdy@crossrambles.com (CROSS)',
                description: post.excerpt,
                link: `/blog/${post.series}/${post.slug}/`,
            };

            if (post.featuredImage) {
                item.customData = `<media:content
                    type="${post.featuredImage.node.mimeType}"
                    width="${post.featuredImage.node.mediaDetails.width}"
                    height="${post.featuredImage.node.mediaDetails.height}"
                    medium="image"
                    url="${post.featuredImage.node.sourceUrl}" />`;
            }

            return item;
        }),
    });
}
