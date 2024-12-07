import { getContent } from "cross:content";
export const prerender = true;

export async function GET({ params }) {
    const story = params.story;
    let data = [];

    // console.log("Params:", params);

    try {
        const response = await getContent('stories', {
            first: 1,
            slug: story
        });
        // console.log("Response:", response);

        if (response) {
            for (const item of response.content.chapters.list) {
                data.push({
                    title: item.title,
                    slug: item.slug,
                    path: item.path
                });
            }
        }
    } catch (error) {
        console.error("Error fetching chapters:", error);
    }

    return new Response(
        JSON.stringify(data),
        {
            status: 200,
            headers: { "Content-Type": "application/json" }
        }
    );
}

export async function getStaticPaths() {
    try {
        const { stories } = await getContent('stories', { first: 9999 });
        // console.log("Static Paths:", stories);

        return stories.map((item) => ({
            params: { story: item.slug }
        }));
    } catch (error) {
        console.error("Error fetching stories:", error);
        return [];
    }
}
