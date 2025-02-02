import {
    navQuery,
    sidebarQuery,
    blogQuery,
    storiesQuery,
    pagesQuery,
    projectQuery,
    heroQuery,
    singleSeriesQuery,
    singleTopicQuery,
    singleTagQuery,
    singleChapterQuery,
    headQuery,
    wpVersionQuery,
    archiveCalendar
} from './api';
import { format } from "date-fns";
import { formatInteger } from "./utils.js";
import { things } from "./content.js";

const Parse = (html = null) => {
    return html.length > 0 ? String(html) : null;
}

const navigation = async () => {
    const data = (await navQuery()).menus.nodes[0].menuItems.nodes;

    let output = [];

    for (const item of data) {
        output.push({
            label: item.label ? Parse(item.label) : null,
            uri: item.uri ? String(item.uri) : null,
            path: item.uri ? String(item.uri) : null,
            order: (item.order === typeof "number") ? Number(item.order) : 0
        });
    }

    return output;
}

const sidebar = async () => {
    const data = await sidebarQuery();

    const output = {
        profile: {
            name: data.sidebar.name,
            bio: data.sidebar.bio,
            mastodon: data.sidebar.mastodon ? {
                instance: data.sidebar.mastodon.instance,
                handle: data.sidebar.mastodon.handle
            } : null,
            birthdate: data.sidebar.birthdate ? {
                raw: new Date(data.sidebar.birthdate).toISOString(),
                formatted: format(new Date(data.sidebar.birthdate), 'MMM. d, yyyy')
            } : null,
            location: data.sidebar.location ? {
                string: String(data.sidebar.location),
                url: String(`https://www.google.com/maps/place/${encodeURIComponent(data.sidebar.location)}`)
            } : null,
            email: data.sidebar.email ? {
                string: String(data.sidebar.email),
                url: String(`mailto:${data.sidebar.email}`)
            } : null,
            photo: data.sidebar.profile.sourceUrl ? {
                filename: data.sidebar.profile.sourceUrl ? String(new URL(data.sidebar.profile.sourceUrl).pathname.split('/').at(-1)) : null,
                source: data.sidebar.profile.sourceUrl ? String(data.sidebar.profile.sourceUrl) : null,
                dominantColor: data.sidebar.profile.mediaDetails.color ? String(data.sidebar.profile.mediaDetails.color) : null,
                dimensions: {
                    width: data.sidebar.profile.mediaDetails.width ? Number(data.sidebar.profile.mediaDetails.width) : 0,
                    height: data.sidebar.profile.mediaDetails.height ? Number(data.sidebar.profile.mediaDetails.height) : 0
                },
                focalPoint: {
                    x: data.sidebar.profile.mediaDetails.x ? String(data.sidebar.profile.mediaDetails.x) : String('0.5'),
                    y: data.sidebar.profile.mediaDetails.y ? String(data.sidebar.profile.mediaDetails.y) : String('0.5')
                }
            } : null
        },
        content: {
            posts: data.posts.nodes.map((post) => ({
                title: post.title ? Parse(post.title) : null,
                slug: post.slug ? String(post.slug) : null,
                path: post.slug ? String(`/blog/${post.series}/${post.slug}`) : null,
            })),
            chapters: data.chapters.nodes.map((chapter) => ({
                chapter: {
                    title: chapter.title ? Parse(chapter.title) : null,
                    slug: chapter.slug ? String(chapter.slug) : null,
                    path: chapter.slug ? String(`/stories/${chapter.story[0].slug}/${chapter.slug}`) : null
                },
                story: {
                    title: chapter.story[0].name ? Parse(chapter.story[0].name) : null,
                    slug: chapter.story[0].slug ? String(chapter.story[0].slug) : null,
                    path: chapter.story[0].slug ? String(`/stories/${chapter.story[0].slug}`) : null
                }
            }))
        },
        taxonomies: {
            series: data.allSeries.nodes.length > 0 ? data.allSeries.nodes.map((series) => ({
                label: series.name ? Parse(series.name) : null,
                slug: series.slug ? String(series.slug) : null,
                path: series.slug ? String(`/blog/${series.slug}`) : null,
                count: series.count ? Number(series.count) : 0
            })) : [],
            topics: data.categories.nodes.length > 0 ? data.categories.nodes.map((cat) => ({
                label: cat.name ? Parse(cat.name) : null,
                slug: cat.slug ? String(cat.slug) : null,
                path: cat.slug ? String(`/archive/topics/${cat.slug}`) : null,
                count: cat.count ? Number(cat.count) : 0
            })) : [],
            tags: data.tags.nodes.length > 0 ? data.tags.nodes.map((tag) => ({
                label: tag.name ? Parse(tag.name) : null,
                slug: tag.slug ? String(tag.slug) : null,
                path: tag.slug ? String(`/archive/tags/${tag.slug}`) : null,
                count: tag.count ? Number(tag.count) : 0
            })) : []
        }
    };

    return output;
}

const posts = async (first = null, after = null, slug = null, series = null, topic = null, tag = null, year = null, search = null) => {
    const data = (await blogQuery(first, after, slug, series, topic, tag, year, search)).posts;

    let output = {
        posts: data.edges.map(({node: post}) => ({
            title: post.title ? Parse(post.title) : null,
            subtitle: post.subtitle ? Parse(post.subtitle) : null,
            slug: post.slug ? String(post.slug) : null,
            path: post.slug ? String(`/blog/${post.series}/${post.slug}`) : null,
            pinned: Boolean(post.isSticky),
            license: post.license ? Parse(post.license) : null,
            readingTime: {
                raw: post.readingTime ? String(post.readingTime) : null,
                formatted: post.readingTime ? String(`${post.readingTime} min read`) : null,
            },
            shortlink: {
                uuid: post.shortlink ? String(`cross.fm/${post.shortlink}`) : null,
                slug: post.slug ? String(`cross.fm/${post.slug}`) : null
            },
            date: {
                raw: new Date(post.date),
                formatted: format(new Date(post.date), 'MMM. d, yyyy')
            },
            writer: {
                name: post.author.node.name ? Parse(post.author.node.name) : null,
            },
            taxonomies: {
                series: {
                    label: post.allSeries.nodes[0].name ? Parse(post.allSeries.nodes[0].name) : null,
                    slug: post.allSeries.nodes[0].slug ? String(post.allSeries.nodes[0].slug) : null,
                    path: post.allSeries.nodes[0].slug ? String(`/blog/${post.allSeries.nodes[0].slug}`) : null,
                    count: post.allSeries.nodes[0].count ? Number(post.allSeries.nodes[0].count) : 0
                },
                topics: post.categories.nodes.length > 0 ? post.categories.nodes.map((topic) => ({
                    label: topic.name ? Parse(topic.name) : null,
                    slug: topic.slug ? String(topic.slug) : null,
                    path: topic.slug ? String(`/archive/topics/${topic.slug}`) : null,
                    count: topic.count ? Number(topic.count) : 0
                })) : [],
                tags: post.tags.nodes.length > 0 ? post.tags.nodes.map((tag) => ({
                    label: tag.name ? Parse(tag.name) : null,
                    slug: tag.slug ? String(tag.slug) : null,
                    path: tag.slug ? String(`/archive/tags/${tag.slug}`) : null,
                    count: tag.count ? Number(tag.count) : 0
                })) : []
            },
            adjacentPosts: {
                previous: post.previousPost ? {
                    title: post.previousPost.title ? Parse(post.previousPost.title) : null,
                    slug: post.previousPost.slug ? String(post.previousPost.slug) : null,
                    path: post.previousPost.slug ? String(`/blog/${post.previousPost.series}/${post.previousPost.slug}`) : null
                } : false,
                next: post.nextPost ? {
                    title: post.nextPost.title ? Parse(post.nextPost.title) : null,
                    slug: post.nextPost.slug ? String(post.nextPost.slug) : null,
                    path: post.nextPost.slug ? String(`/blog/${post.nextPost.series}/${post.nextPost.slug}`) : null
                } : false
            },
            content: {
                excerpt: post.excerpt ? Parse(post.excerpt) : null,
                full: {
                    raw: post.content ? Parse(post.content) : null,
                    blocks: post.editorBlocks || null
                },
                toc: post.toc ? Parse(post.toc) : false,
                thumbnail: post.featuredImage && post.featuredImage.node ? {
                    mimeType: String(post.featuredImage.node.mimeType),
                    filename: post.featuredImage.node.sourceUrl ? String(new URL(post.featuredImage.node.sourceUrl).pathname.split('/').at(-1)) : null,
                    source: post.featuredImage.node.sourceUrl ? String(post.featuredImage.node.sourceUrl) : null,
                    dominantColor: post.featuredImage.node.mediaDetails.color ? String(post.featuredImage.node.mediaDetails.color) : null,
                    dimensions: {
                        width: post.featuredImage.node.mediaDetails.width ? Number(post.featuredImage.node.mediaDetails.width) : 0,
                        height: post.featuredImage.node.mediaDetails.height ? Number(post.featuredImage.node.mediaDetails.height) : 0
                    },
                    focalPoint: {
                        x: post.featuredImage.node.mediaDetails.x ? String(post.featuredImage.node.mediaDetails.x) : String('0.5'),
                        y: post.featuredImage.node.mediaDetails.y ? String(post.featuredImage.node.mediaDetails.y) : String('0.5')
                    }
                } : null
            }
        })),
        paginate: {
            totalPosts: data.edges.length,
            nextPage: Boolean(data.pageInfo.hasNextPage),
            cursor: data.pageInfo.endCursor ? String(data.pageInfo.endCursor) : null
        }
    };

    return first === 1 ? output.posts[0] : output;
}

const projects = async (first = null, after = null, slug = null) => {
    const data = (await projectQuery(first, after, slug)).projects;

    const output = {
        projects: data.edges.map(({node: post}) => ({
            title: post.title ? Parse(post.title) : null,
            slug: post.slug ? String(post.slug) : null,
            path: post.slug ? String(`/projects/${post.slug}`) : null,
            date: {
                raw: new Date(post.date),
                formatted: format(new Date(post.date), 'MMM. d, yyyy')
            },
            content: {
                excerpt: post.excerpt ? Parse(post.excerpt) : null,
                full: {
                    raw: post.content ? Parse(post.content) : null,
                    blocks: post.editorBlocks || null
                },
                thumbnail: post.featuredImage && post.featuredImage.node ? {
                    mimeType: String(post.featuredImage.node.mimeType),
                    filename: post.featuredImage.node.sourceUrl ? String(new URL(post.featuredImage.node.sourceUrl).pathname.split('/').at(-1)) : null,
                    source: post.featuredImage.node.sourceUrl ? String(post.featuredImage.node.sourceUrl) : null,
                    dominantColor: post.featuredImage.node.mediaDetails.color ? String(post.featuredImage.node.mediaDetails.color) : null,
                    dimensions: {
                        width: post.featuredImage.node.mediaDetails.width ? Number(post.featuredImage.node.mediaDetails.width) : 0,
                        height: post.featuredImage.node.mediaDetails.height ? Number(post.featuredImage.node.mediaDetails.height) : 0
                    },
                    focalPoint: {
                        x: post.featuredImage.node.mediaDetails.x ? String(post.featuredImage.node.mediaDetails.x) : String('0.5'),
                        y: post.featuredImage.node.mediaDetails.y ? String(post.featuredImage.node.mediaDetails.y) : String('0.5')
                    }
                } : null,
                gallery: post.gallery && post.gallery.length ? post.gallery.map((image) => {
                    return {
                        content: {
                            caption: image?.caption ? String(image?.caption) : ""
                        },
                        mimeType: String(image.mimeType),
                        filename: image.sourceUrl ? String(new URL(image.sourceUrl).pathname.split('/').at(-1)) : null,
                        source: image.sourceUrl ? String(image.sourceUrl) : null,
                        dominantColor: image.mediaDetails.color ? String(image.mediaDetails.color) : null,
                        dimensions: {
                            width: image.mediaDetails.width ? Number(image.mediaDetails.width) : 0,
                            height: image.mediaDetails.height ? Number(image.mediaDetails.height) : 0
                        },
                        focalPoint: {
                            x: image.mediaDetails.x ? String(image.mediaDetails.x) : String('0.5'),
                            y: image.mediaDetails.y ? String(image.mediaDetails.y) : String('0.5')
                        }
                    }
                }) : []
            }
        })),
        paginate: {
            totalPosts: data.edges.length,
            nextPage: Boolean(data.pageInfo.hasNextPage),
            cursor: data.pageInfo.endCursor ? String(data.pageInfo.endCursor) : null
        }
    };

    return first === 1 ? output.projects[0] : output;
}

const pages = async (first = null, after = null, slug = null) => {
    const data = (await pagesQuery(first, after, slug)).pages;

    const output = {
        pages: data.edges.map(({node: post}) => ({
            title: post.title ? Parse(post.title) : null,
            slug: post.slug ? String(post.slug) : null,
            path: post.slug ? String(`/${post.slug}`) : null,
            date: {
                raw: new Date(post.date),
                formatted: format(new Date(post.date), 'MMM. d, yyyy')
            },
            content: {
                full: {
                    raw: post.content ? Parse(post.content) : null,
                    blocks: post.editorBlocks || null
                }
            }
        })),
        paginate: {
            totalPosts: data.edges.length,
            nextPage: Boolean(data.pageInfo.hasNextPage),
            cursor: data.pageInfo.endCursor ? String(data.pageInfo.endCursor) : null
        }
    };

    return first === 1 ? output.pages[0] : output;
}

const stories = async (first = 10, after = null, slug = null) => {
    const firstPosts = first ? first : 1;
    const data = (await storiesQuery(firstPosts, after, slug)).stories;

    let output = {
        stories: data.edges.map(({node: story}) => ({
            title: story.name ? Parse(story.name) : null,
            slug: story.slug ? String(story.slug) : null,
            path: story.slug ? String(`/stories/${story.slug}`) : null,
            date: {
                raw: new Date(story.chapters.nodes[0].date).toISOString(),
                formatted: format(new Date(story.chapters.nodes[0].date), 'MMM. d, yyyy')
            },
            content: {
                summary: story.description ? Parse(story.description) : null,
                chapters: {
                    count: Number(story.count),
                    list: story.chapters.nodes.length > 0 ? story.chapters.nodes.map((chapter) => ({
                        title: chapter.title ? Parse(chapter.title) : null,
                        slug: chapter.slug ? String(chapter.slug) : null,
                        path: chapter.slug ? String(`/stories/${story.slug}/${chapter.slug}`) : null,
                        date: {
                            raw: new Date(chapter.date).toISOString(),
                            formatted: format(new Date(chapter.date), 'MMM. d, yyyy')
                        },
                        wordCount: {
                            raw: chapter.wordCount ? Number(chapter.wordCount) : 0,
                            formatted: chapter.wordCount ? formatInteger(chapter.wordCount) : 0
                        }
                    })) : []
                },
                images: {
                    cover: {
                        filename: story.images[0].cover.sourceUrl ? String(new URL(story.images[0].cover.sourceUrl).pathname.split('/').at(-1)) : null,
                        source: story.images[0].cover.sourceUrl ? String(story.images[0].cover.sourceUrl) : null,
                        dominantColor: story.images[0].cover.mediaDetails.color ? String(story.images[0].cover.mediaDetails.color) : null,
                        dimensions: {
                            width: story.images[0].cover.mediaDetails.width ? Number(story.images[0].cover.mediaDetails.width) : 0,
                            height: story.images[0].cover.mediaDetails.height ? Number(story.images[0].cover.mediaDetails.height) : 0
                        },
                        focalPoint: {
                            x: story.images[0].cover.mediaDetails.x ? String(story.images[0].cover.mediaDetails.x) : String('0.5'),
                            y: story.images[0].cover.mediaDetails.y ? String(story.images[0].cover.mediaDetails.y) : String('0.5')
                        }
                    },
                    banner: {
                        filename: story.images[0].banner.sourceUrl ? String(new URL(story.images[0].banner.sourceUrl).pathname.split('/').at(-1)) : null,
                        source: story.images[0].banner.sourceUrl ? String(story.images[0].banner.sourceUrl) : null,
                        dominantColor: story.images[0].banner.mediaDetails.color ? String(story.images[0].banner.mediaDetails.color) : null,
                        dimensions: {
                            width: story.images[0].banner.mediaDetails.width ? Number(story.images[0].banner.mediaDetails.width) : 0,
                            height: story.images[0].banner.mediaDetails.height ? Number(story.images[0].banner.mediaDetails.height) : 0
                        },
                        focalPoint: {
                            x: story.images[0].banner.mediaDetails.x ? String(story.images[0].banner.mediaDetails.x) : String('0.5'),
                            y: story.images[0].banner.mediaDetails.y ? String(story.images[0].banner.mediaDetails.y) : String('0.5')
                        }
                    },
                    background: {
                        filename: story.images[0].background.sourceUrl ? String(new URL(story.images[0].background.sourceUrl).pathname.split('/').at(-1)) : null,
                        source: story.images[0].background.sourceUrl ? String(story.images[0].background.sourceUrl) : null,
                        dominantColor: story.images[0].background.mediaDetails.color ? String(story.images[0].background.mediaDetails.color) : null,
                        dimensions: {
                            width: story.images[0].background.mediaDetails.width ? Number(story.images[0].background.mediaDetails.width) : 0,
                            height: story.images[0].background.mediaDetails.height ? Number(story.images[0].background.mediaDetails.height) : 0
                        },
                        focalPoint: {
                            x: story.images[0].background.mediaDetails.x ? String(story.images[0].background.mediaDetails.x) : String('0.5'),
                            y: story.images[0].background.mediaDetails.y ? String(story.images[0].background.mediaDetails.y) : String('0.5')
                        }
                    }
                }
            }
        })),
        paginate: {
            totalPosts: data.edges.length,
            nextPage: Boolean(data.pageInfo.hasNextPage),
            cursor: data.pageInfo.endCursor ? String(data.pageInfo.endCursor) : null
        }
    };

    return first === 1 ? output.stories[0] : output;
}

const chapters = async (slug = null) => {
    const data = (await singleChapterQuery(slug)).chapters.nodes;

    let output = [];

    for (const chapter of data) {
        output.push({
            title: chapter.title ? Parse(chapter.title) : null,
            slug: chapter.slug ? String(chapter.slug) : null,
            path: chapter.slug ? String(`/stories/${chapter.story[0].slug}/${chapter.slug}`) : null,
            date: {
                raw: new Date(chapter.date),
                formatted: format(new Date(chapter.date), 'MMM. d, yyyy')
            },
            story: {
                title: chapter.story[0].name ? String(chapter.story[0].name) : null,
                slug: chapter.story[0].slug ? String(chapter.story[0].slug) : null,
                path: chapter.story[0].slug ? String(`/stories/${chapter.story[0].slug}`) : null,
                content: {
                    summary: chapter.story[0].description ? String(chapter.story[0].description) : null,
                    images: {
                        cover: {
                            filename: chapter.story[0].images[0].cover.sourceUrl ? String(new URL(chapter.story[0].images[0].cover.sourceUrl).pathname.split('/').at(-1)) : null,
                            source: chapter.story[0].images[0].cover.sourceUrl ? String(chapter.story[0].images[0].cover.sourceUrl) : null,
                            dominantColor: chapter.story[0].images[0].cover.mediaDetails.color ? String(chapter.story[0].images[0].cover.mediaDetails.color) : null,
                            dimensions: {
                                width: chapter.story[0].images[0].cover.mediaDetails.width ? Number(chapter.story[0].images[0].cover.mediaDetails.width) : 0,
                                height: chapter.story[0].images[0].cover.mediaDetails.height ? Number(chapter.story[0].images[0].cover.mediaDetails.height) : 0
                            },
                            focalPoint: {
                                x: chapter.story[0].images[0].cover.mediaDetails.x ? String(chapter.story[0].images[0].cover.mediaDetails.x) : String('0.5'),
                                y: chapter.story[0].images[0].cover.mediaDetails.y ? String(chapter.story[0].images[0].cover.mediaDetails.y) : String('0.5')
                            }
                        },
                        banner: {
                            filename: chapter.story[0].images[0].banner.sourceUrl ? String(new URL(chapter.story[0].images[0].banner.sourceUrl).pathname.split('/').at(-1)) : null,
                            source: chapter.story[0].images[0].banner.sourceUrl ? String(chapter.story[0].images[0].banner.sourceUrl) : null,
                            dominantColor: chapter.story[0].images[0].banner.mediaDetails.color ? String(chapter.story[0].images[0].banner.mediaDetails.color) : null,
                            dimensions: {
                                width: chapter.story[0].images[0].banner.mediaDetails.width ? Number(chapter.story[0].images[0].banner.mediaDetails.width) : 0,
                                height: chapter.story[0].images[0].banner.mediaDetails.height ? Number(chapter.story[0].images[0].banner.mediaDetails.height) : 0
                            },
                            focalPoint: {
                                x: chapter.story[0].images[0].banner.mediaDetails.x ? String(chapter.story[0].images[0].banner.mediaDetails.x) : String('0.5'),
                                y: chapter.story[0].images[0].banner.mediaDetails.y ? String(chapter.story[0].images[0].banner.mediaDetails.y) : String('0.5')
                            }
                        },
                        background: {
                            filename: chapter.story[0].images[0].background.sourceUrl ? String(new URL(chapter.story[0].images[0].background.sourceUrl).pathname.split('/').at(-1)) : null,
                            source: chapter.story[0].images[0].background.sourceUrl ? String(chapter.story[0].images[0].background.sourceUrl) : null,
                            dominantColor: chapter.story[0].images[0].background.mediaDetails.color ? String(chapter.story[0].images[0].background.mediaDetails.color) : null,
                            dimensions: {
                                width: chapter.story[0].images[0].background.mediaDetails.width ? Number(chapter.story[0].images[0].background.mediaDetails.width) : 0,
                                height: chapter.story[0].images[0].background.mediaDetails.height ? Number(chapter.story[0].images[0].background.mediaDetails.height) : 0
                            },
                            focalPoint: {
                                x: chapter.story[0].images[0].background.mediaDetails.x ? String(chapter.story[0].images[0].background.mediaDetails.x) : String('0.5'),
                                y: chapter.story[0].images[0].background.mediaDetails.y ? String(chapter.story[0].images[0].background.mediaDetails.y) : String('0.5')
                            }
                        }
                    }
                }
            },
            adjacentPosts: {
                previous: chapter.previousPost ? {
                    title: chapter.previousPost.title ? Parse(chapter.previousPost.title) : null,
                    slug: chapter.previousPost.slug ? String(chapter.previousPost.slug) : null,
                    path: chapter.previousPost.slug ? String(`/stories/${chapter.story[0].slug}/${chapter.previousPost.slug}`) : null
                } : false,
                next: chapter.nextPost ? {
                    title: chapter.nextPost.title ? Parse(chapter.nextPost.title) : null,
                    slug: chapter.nextPost.slug ? String(chapter.nextPost.slug) : null,
                    path: chapter.nextPost.slug ? String(`/stories/${chapter.story[0].slug}/${chapter.nextPost.slug}`) : null
                } : false
            },
            content: {
                full: {
                    raw: chapter.content ? Parse(chapter.content) : null,
                    blocks: chapter.editorBlocks || null
                }
            }
        })
    }

    return slug ? output[0] : output;
}

const hero = async () => {
    const data = (await heroQuery()).hero;

    const output = {
        profile: {
            name: data.name ? Parse(data.name) : null,
            mastodon: {
                instance: data.mastodon.instance ? String(data.mastodon.instance) : null,
                handle: data.mastodon.handle ? String(data.mastodon.handle) : null
            },
            photo: {
                filename: data.profileImage.sourceUrl ? String(new URL(data.profileImage.sourceUrl).pathname.split('/').at(-1)) : null,
                source: data.profileImage.sourceUrl ? String(data.profileImage.sourceUrl) : null,
                dominantColor: data.profileImage.mediaDetails.color ? String(data.profileImage.mediaDetails.color) : null,
                dimensions: {
                    width: data.profileImage.mediaDetails.width ? Number(data.profileImage.mediaDetails.width) : 0,
                    height: data.profileImage.mediaDetails.height ? Number(data.profileImage.mediaDetails.height) : 0
                },
                focalPoint: {
                    x: data.profileImage.mediaDetails.x ? String(data.profileImage.mediaDetails.x) : String('0.5'),
                    y: data.profileImage.mediaDetails.y ? String(data.profileImage.mediaDetails.y) : String('0.5')
                }
            }
        },
        banner: {
            filename: data.bannerImage.sourceUrl ? String(new URL(data.bannerImage.sourceUrl).pathname.split('/').at(-1)) : null,
            source: data.bannerImage.sourceUrl ? String(data.bannerImage.sourceUrl) : null,
            dominantColor: data.bannerImage.mediaDetails.color ? String(data.bannerImage.mediaDetails.color) : null,
            dimensions: {
                width: data.bannerImage.mediaDetails.width ? Number(data.bannerImage.mediaDetails.width) : 0,
                height: data.bannerImage.mediaDetails.height ? Number(data.bannerImage.mediaDetails.height) : 0
            },
            focalPoint: {
                x: data.bannerImage.mediaDetails.x ? String(data.bannerImage.mediaDetails.x) : String('0.5'),
                y: data.bannerImage.mediaDetails.y ? String(data.bannerImage.mediaDetails.y) : String('0.5')
            }
        }
    }

    return output;
}

const series = async (series = null) => {
    const term = series ? [series] : null;
    const data = (await singleSeriesQuery(term)).allSeries.nodes;

    let output = [];

    for (const item of data) {
        output.push({
            label: item.name ? Parse(item.name) : null,
            slug: item.slug ? String(item.slug) : null,
            path: item.slug ? String(`/blog/${item.slug}`) : null,
            count: item.count ? Number(item.count) : 0,
            content: {
                summary: item.description ? Parse(item.description) : null
            }
        })
    }

    return series ? output[0] : output;
}

const topics = async (topic = null) => {
    const term = topic ? [topic] : null;
    const data = (await singleTopicQuery(term)).categories.nodes;

    let output = [];

    for (const item of data) {
        output.push({
            label: item.name ? Parse(item.name) : null,
            slug: item.slug ? String(item.slug) : null,
            path: item.slug ? String(`/archive/topics/${item.slug}`) : null,
            count: item.count ? Number(item.count) : 0,
            content: {
                summary: item.description ? Parse(item.description) : null
            }
        })
    }

    return topic ? output[0] : output;
}

const tags = async (tag = null) => {
    const term = tag ? [tag] : null;
    const data = (await singleTagQuery(term)).tags.nodes;

    let output = [];

    for (const item of data) {
        output.push({
            label: item.name ? Parse(item.name) : null,
            slug: item.slug ? String(item.slug) : null,
            path: item.slug ? String(`/archive/tags/${item.slug}`) : null,
            count: item.count ? Number(item.count) : 0,
            content: {
                summary: item.description ? Parse(item.description) : null
            }
        })
    }

    return tag ? output[0] : output;
}

const head = async (path) => {
    const data = await headQuery(`https://crossrambles.com${path}`);
    return data.head;
}

const footer = async () => {
    const data = await wpVersionQuery();
    return data;
}

const calendar = async () => {
    const data = await archiveCalendar();
    return data;
}

/**
 * @param {string} collection
 * @param {{
 *   first?: number | null,
 *   after?: string | null,
 *   slug?: string | null,
 *   series?: string | null,
 *   topic?: string | null,
 *   tag?: string | null,
 *   search?: string | null,
 *   year?: string | null
 * }} [query]
 */
const getContent = async (collection, query = {
    first: null,
    after: null,
    slug: null,
    series: null
} | null) => {
    let result;
    switch (collection) {
        case 'navigation':
            result = await navigation();
            break;
        case 'sidebar':
            result = await sidebar();
            break;
        case 'posts':
            result = await posts(query.first, query.after, query.slug, query.series, query.topic, query.tag, query.year, query.search);
            break;
        case 'projects':
            result = await projects(query.first, query.after, query.slug);
            break;
        case 'pages':
            result = await pages(query.first, query.after, query.slug);
            break;
        case 'stories':
            result = await stories(query.first, query.after, query.slug);
            break;
        case 'chapters':
            result = await chapters(query.slug);
            break;
        case 'hero':
            result = await hero();
            break;
        case 'series':
            result = await series(query.slug);
            break;
        case 'topics':
            result = await topics(query.slug);
            break;
        case 'tags':
            result = await tags(query.slug);
            break;
        case 'things':
            result = await things();
            break;
    }

    return result;
}

const getHead = async (path) => {
    return await head(path);
}

const getFooter = async () => {
    return await footer();
}

const getCalendar = async () => {
    return await calendar();
}

export { getContent, getHead, getFooter, getCalendar }