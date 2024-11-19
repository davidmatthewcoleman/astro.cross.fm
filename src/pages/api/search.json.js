import { blogQuery } from "../../lib/api.js";
import Parse from "html-react-parser";

export const prerender = true;

export const GET = async () => {
    const response = await blogQuery(9999);

    const data = response.posts.edges;

    const results = [];
    for (const post of data) {
        results.push({
            title: post.node.title ? Parse(post.node.title) : null,
            uri: String(`/blog/${post.node.series}/${post.node.slug}`),
            section: "blog",
            tags: post.node.categories ? post.node.categories.nodes.map((cat) => {
                return cat.name;
            }): [],
            description: post.node.excerpt || null,
            content: post.node.content || null
        });
    }

    return new Response(
        JSON.stringify(results), {
            status: 200,
            headers: {
                "Content-Type": "application/json"
            }
        }
    );
}