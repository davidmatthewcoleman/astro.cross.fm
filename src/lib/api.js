import NodeCache from "node-cache";
import fetch from "node-fetch";

export async function navQuery(){
    const siteNavQueryRes = await fetch(import.meta.env.WORDPRESS_API_URL, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.WORDPRESS_API_TOKEN}`,
            'User-Agent': 'CROSS-FETCH'
        },
        body: JSON.stringify({
            query: `{
                menus(where: {location: PRIMARY}) {
                  nodes {
                    name
                    menuItems {
                        nodes {
                            uri
                            url
                            order
                            label
                        }
                    }
                  }
                }
            }
            `
        })
    });
    const{ data } = await siteNavQueryRes.json();
    return data;
}

export async function sidebarQuery(){
    const response = await fetch(import.meta.env.WORDPRESS_API_URL, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.WORDPRESS_API_TOKEN}`,
            'User-Agent': 'CROSS-FETCH'
        },
        body: JSON.stringify({
            query: `{
                  sidebar {
                    name
                    bio
                    birthdate
                    location
                    email
                    profile {
                      sourceUrl,
                      sourceFile
                      mediaDetails {
                        width
                        height
                        x
                        y
                        color
                      }
                    }
                  }
                  posts(first: 5) {
                    nodes {
                      title
                      slug
                      series
                    }
                  }
                  chapters(first: 5) {
                    nodes {
                      title
                      slug
                      story {
                        name
                        slug
                      }
                    }
                  }
                  allSeries(first: 12, where: {hideEmpty: true}) {
                    nodes {
                      name
                      slug
                      count
                    }
                  }
                  categories(first: 12, where: {hideEmpty: true}) {
                    nodes {
                      name
                      slug
                      count
                    }
                  }
                  tags(first: 12, where: {hideEmpty: true}) {
                    nodes {
                      name
                      slug
                      count
                    }
                  }
                }
            `
        })
    });
    const{ data } = await response.json();
    return data;
}

export async function projectQuery(first = null, after = null, slug = null) {
    first = first || 9999;
    const variables = { first, after, slug };

    try {
        const response = await fetch(import.meta.env.WORDPRESS_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${import.meta.env.WORDPRESS_API_TOKEN}`,
            'User-Agent': 'CROSS-FETCH'
            },
            body: JSON.stringify({
                query: `
                  query GetPaginatedProjects($first: Int!, $after: String, $slug: String) {
                      projects(
                        first: $first
                        after: $after
                        where: {name: $slug}
                      ) {
                        pageInfo {
                          endCursor
                          hasNextPage
                        }
                        edges {
                          node {
                            title
                            slug
                            excerpt
                            content
                            date
                            dateGmt
                            featuredImage {
                              node {
                                mimeType
                                sourceUrl
                                sourceFile
                                mediaDetails {
                                  width
                                  height
                                  x
                                  y
                                  color
                                }
                              }
                            }
                            gallery {
                                caption
                                mimeType
                                sourceFile
                                sourceUrl
                                mediaDetails {
                                  width
                                  height
                                  x
                                  y
                                  color
                                }
                              }
                            editorBlocks(flat: false) {
                              clientId
                              blockEditorCategoryName
                              cssClassNames
                              isDynamic
                              name
                              renderedHtml
                              type
                              ... on CoreParagraph {
                                attributes {
                                  cssClassName
                                  content
                                }
                                renderedHtml
                              }
                              ... on CoreEmbed {
                                attributes {
                                  url
                                  type
                                  className
                                  caption
                                  align
                                }
                              }
                              ... on CoreImage {
                                attributes {
                                  src
                                  width
                                  height
                                  aspectRatio
                                  className
                                  cssClassName
                                  alt
                                  align
                                  caption
                                  href
                                  linkClass
                                  linkDestination
                                  linkTarget
                                  metadata
                                  scale
                                  sizeSlug
                                  style
                                  title
                                  url
                                }
                              }
                              ... on CoreQuote {
                                attributes {
                                  align
                                  citation
                                  className
                                  cssClassName
                                  metadata
                                  textColor
                                  value
                                }
                              }
                              ... on AcfAlert {
                                name
                                attributes {
                                  data
                                }
                                innerBlocks {
                                  renderedHtml
                                  name
                                }
                              }
                              ... on CoreList {
                                attributes {
                                  cssClassName
                                  className
                                  metadata
                                  ordered
                                  start
                                  values
                                }
                              }
                              ... on AcfBookmark {
                                name
                                renderedHtml
                                clientId
                              }
                            }
                          }
                        }
                      }
                    }
                `,
                variables
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const { data } = await response.json();

        return data;
    } catch (error) {
        console.error('Error fetching paginated projects:', error);
        throw error;
    }
}

export async function blogQuery(first = null, after = null, slug = null, series = null, topic = null, tag = null, search = null) {
    first = first || 9999;
    const variables = { first, after, slug, series, topic, tag, search };

    try {
        const response = await fetch(import.meta.env.WORDPRESS_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${import.meta.env.WORDPRESS_API_TOKEN}`,
            'User-Agent': 'CROSS-FETCH'
            },
            body: JSON.stringify({
                query: `
                  query GetPaginatedPosts($first: Int!, $after: String, $slug: String, $series: String, $topic: String, $tag: [String], $search: String) {
                      posts(
                        first: $first
                        after: $after
                        where: {stickyPosts: true, name: $slug, seriesSlugIn: $series, categoryName: $topic, tagSlugIn: $tag, search: $search}
                      ) {
                        pageInfo {
                          endCursor
                          hasNextPage
                        }
                        edges {
                          node {
                            title
                            subtitle
                            slug
                            series
                            shortlink
                            excerpt
                            content
                            date
                            dateGmt
                            readingTime
                            isSticky
                            license
                            toc
                            author {
                              node {
                                name
                              }
                            }
                            previousPost {
                              title
                              slug
                              series
                            }
                            nextPost {
                              title
                              slug
                              series
                            }
                            featuredImage {
                              node {
                                mimeType
                                sourceUrl
                                sourceFile
                                mediaDetails {
                                  width
                                  height
                                  x
                                  y
                                  color
                                }
                              }
                            }
                            allSeries {
                              nodes {
                                name
                                slug
                                count
                              }
                            }
                            categories {
                              nodes {
                                name
                                slug
                                count
                              }
                            }
                            tags {
                              nodes {
                                name
                                slug
                                count
                              }
                            }
                            editorBlocks(flat: false) {
                              clientId
                              blockEditorCategoryName
                              cssClassNames
                              isDynamic
                              name
                              renderedHtml
                              type
                              ... on CoreParagraph {
                                attributes {
                                  cssClassName
                                  content
                                }
                                renderedHtml
                              }
                              ... on CoreEmbed {
                                attributes {
                                  url
                                  type
                                  className
                                  caption
                                  align
                                }
                              }
                              ... on CoreImage {
                                attributes {
                                  src
                                  width
                                  height
                                  aspectRatio
                                  className
                                  cssClassName
                                  alt
                                  align
                                  caption
                                  href
                                  linkClass
                                  linkDestination
                                  linkTarget
                                  metadata
                                  scale
                                  sizeSlug
                                  style
                                  title
                                  url
                                }
                              }
                              ... on CoreQuote {
                                attributes {
                                  align
                                  citation
                                  className
                                  cssClassName
                                  metadata
                                  textColor
                                  value
                                }
                              }
                              ... on AcfAlert {
                                name
                                attributes {
                                  data
                                }
                                innerBlocks {
                                  renderedHtml
                                  name
                                }
                              }
                              ... on CoreList {
                                attributes {
                                  cssClassName
                                  className
                                  metadata
                                  ordered
                                  start
                                  values
                                }
                              }
                              ... on AcfBookmark {
                                name
                                renderedHtml
                                clientId
                              }
                            }
                          }
                        }
                      }
                    }
                `,
                variables
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const { data } = await response.json();

        return data;
    } catch (error) {
        console.error('Error fetching paginated posts:', error);
        throw error;
    }
}

export async function pagesQuery(first = null, after = null, slug = null) {
    first = first || 9999;
    const variables = { first, after, slug };

    try {
        const response = await fetch(import.meta.env.WORDPRESS_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${import.meta.env.WORDPRESS_API_TOKEN}`,
            'User-Agent': 'CROSS-FETCH'
            },
            body: JSON.stringify({
                query: `
                  query GetPaginatedPosts($first: Int!, $after: String, $slug: String) {
                    pages(first: $first, after: $after, where: { name: $slug }) {
                      pageInfo {
                        endCursor
                        hasNextPage
                      }
                      edges {
                        node {
                          title
                          slug
                          content
                          date
                          dateGmt,
                          editorBlocks(flat: false) {
                              clientId
                              blockEditorCategoryName
                              cssClassNames
                              isDynamic
                              name
                              renderedHtml
                              type
                              ... on CoreParagraph {
                                attributes {
                                  cssClassName
                                  content
                                }
                                renderedHtml
                              }
                              ... on CoreEmbed {
                                attributes {
                                  url
                                  type
                                  className
                                  caption
                                  align
                                }
                              }
                              ... on CoreImage {
                                attributes {
                                  src
                                  width
                                  height
                                  aspectRatio
                                  className
                                  cssClassName
                                  alt
                                  align
                                  caption
                                  href
                                  linkClass
                                  linkDestination
                                  linkTarget
                                  metadata
                                  scale
                                  sizeSlug
                                  style
                                  title
                                  url
                                }
                              }
                              ... on CoreQuote {
                                attributes {
                                  align
                                  citation
                                  className
                                  cssClassName
                                  metadata
                                  textColor
                                  value
                                }
                              }
                              ... on AcfAlert {
                                name
                                attributes {
                                  data
                                }
                                innerBlocks {
                                  renderedHtml
                                  name
                                }
                              }
                              ... on CoreList {
                                attributes {
                                  cssClassName
                                  className
                                  metadata
                                  ordered
                                  start
                                  values
                                }
                              }
                              ... on AcfBookmark {
                                name
                                renderedHtml
                                clientId
                              }
                            }
                        }
                      }
                    }
                  }
                `,
                variables
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const { data } = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching paginated posts:', error);
        throw error;
    }
}

export async function blogSearchQuery(search, first, after = null) {
    const variables = { search, first, after };

    try {
        const response = await fetch(import.meta.env.WORDPRESS_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${import.meta.env.WORDPRESS_API_TOKEN}`,
            'User-Agent': 'CROSS-FETCH'
            },
            body: JSON.stringify({
                query: `
                  query GetPaginatedSearchedPosts($search: String, $first: Int!, $after: String) {
                    posts(first: $first, after: $after, where: { search: $search }) {
                      pageInfo {
                        endCursor
                        hasNextPage
                      }
                      edges {
                        node {
                          title
                          slug
                          series
                          excerpt
                          date
                          dateGmt
                          readingTime
                          isSticky
                          featuredImage {
                            node {
                              sourceUrl
                              sourceFile
                              mediaDetails {
                                width
                                height
                                x
                                y
                                color
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                `,
                variables
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const { data } = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching paginated posts:', error);
        throw error;
    }
}

export async function storiesQuery(first, after = null, slug = null) {
    const variables = { first, after, slug };

    try {
        const response = await fetch(import.meta.env.WORDPRESS_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${import.meta.env.WORDPRESS_API_TOKEN}`,
            'User-Agent': 'CROSS-FETCH'
            },
            body: JSON.stringify({
                query: `
                  query GetPaginatedStories($first: Int!, $after: String, $slug: [String]) {
                      stories(first: $first, after: $after, where: { slug: $slug }) {
                        pageInfo {
                          endCursor
                          hasNextPage
                        }
                        edges {
                          node {
                            name
                            slug
                            count
                            description
                            images {
                              cover {
                                sourceUrl
                                sourceFile
                                mediaDetails {
                                  width
                                  height
                                  x
                                  y
                                  color
                                }
                              }
                              banner {
                                sourceUrl
                                sourceFile
                                mediaDetails {
                                  width
                                  height
                                  x
                                  y
                                  color
                                }
                              }
                              background {
                                sourceUrl
                                sourceFile
                                mediaDetails {
                                  width
                                  height
                                  x
                                  y
                                  color
                                }
                              }
                            }
                            chapters(where: {orderby: {field: MENU_ORDER, order: ASC}}) {
                              nodes {
                                title
                                slug
                                date
                                wordCount
                              }
                            }
                          }
                        }
                      }
                    }
                `,
                variables
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const { data } = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching paginated stories:', error);
        throw error;
    }
}

export async function seriesQuery(series = null, first, after = null) {
    const variables = { series, first, after };

    try {
        const response = await fetch(import.meta.env.WORDPRESS_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${import.meta.env.WORDPRESS_API_TOKEN}`,
            'User-Agent': 'CROSS-FETCH'
            },
            body: JSON.stringify({
                query: `
                  query GetPaginatedPosts($first: Int!, $after: String, $series: String) {
                    posts(first: $first, after: $after, , where: {seriesSlugIn: $series}) {
                      pageInfo {
                        endCursor
                        hasNextPage
                      }
                      edges {
                        node {
                          title
                          slug
                          series
                          excerpt
                          date
                          dateGmt
                          readingTime
                          isSticky
                          featuredImage {
                            node {
                              sourceUrl
                              sourceFile
                              mediaDetails {
                                width
                                height
                                x
                                y
                                color
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                `,
                variables
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const { data } = await response.json();

        return data;
    } catch (error) {
        console.error('Error fetching paginated posts:', error);
        throw error;
    }
}



export async function topicQuery(category = null, first, after = null) {
    const variables = { category, first, after };

    try {
        const response = await fetch(import.meta.env.WORDPRESS_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${import.meta.env.WORDPRESS_API_TOKEN}`,
            'User-Agent': 'CROSS-FETCH'
            },
            body: JSON.stringify({
                query: `
                  query GetPaginatedPosts($first: Int!, $after: String, $category: String) {
                    posts(first: $first, after: $after, , where: {categoryName: $category}) {
                      pageInfo {
                        endCursor
                        hasNextPage
                      }
                      edges {
                        node {
                          title
                          slug
                          series
                          excerpt
                          date
                          dateGmt
                          readingTime
                          isSticky
                          featuredImage {
                            node {
                              sourceUrl
                              sourceFile
                              mediaDetails {
                                width
                                height
                                x
                                y
                                color
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                `,
                variables
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const { data } = await response.json();

        return data;
    } catch (error) {
        console.error('Error fetching paginated posts:', error);
        throw error;
    }
}

export async function tagQuery(tag = null, first, after = null) {
    const variables = { tag, first, after };

    try {
        const response = await fetch(import.meta.env.WORDPRESS_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${import.meta.env.WORDPRESS_API_TOKEN}`,
            'User-Agent': 'CROSS-FETCH'
            },
            body: JSON.stringify({
                query: `
                  query GetPaginatedPosts($first: Int!, $after: String, $tag: String) {
                    posts(first: $first, after: $after, , where: {tagSlugIn: [$tag]}) {
                      pageInfo {
                        endCursor
                        hasNextPage
                      }
                      edges {
                        node {
                          title
                          slug
                          series
                          excerpt
                          date
                          dateGmt
                          readingTime
                          isSticky
                          featuredImage {
                            node {
                              sourceUrl
                              sourceFile
                              mediaDetails {
                                width
                                height
                                x
                                y
                                color
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                `,
                variables
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const { data } = await response.json();

        return data;
    } catch (error) {
        console.error('Error fetching paginated posts:', error);
        throw error;
    }
}



export async function homepageQuery(){
    const response = await fetch(import.meta.env.WORDPRESS_API_URL, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.WORDPRESS_API_TOKEN}`,
            'User-Agent': 'CROSS-FETCH'
        },
        body: JSON.stringify({
            query: `{
                  pageBy(uri: "home") {
                    title
                    content
                  }
                  posts(first: 1) {
                    nodes {
                      title
                      slug
                      series
                      excerpt
                      date
                      dateGmt
                    }
                  }
                }
            `
        })
    });
    const{ data } = await response.json();
    return data;
}

export async function heroQuery(){
    const response = await fetch(import.meta.env.WORDPRESS_API_URL, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.WORDPRESS_API_TOKEN}`,
            'User-Agent': 'CROSS-FETCH'
        },
        body: JSON.stringify({
            query: `{
                  hero {
                    name
                    mastodon {
                      instance
                      handle
                    }
                    bannerImage {
                      sourceUrl
                      sourceFile
                      mediaDetails {
                        width
                        height
                        x
                        y
                        color
                      }
                    }
                    profileImage {
                      sourceUrl
                      sourceFile
                      mediaDetails {
                        width
                        height
                        x
                        y
                        color
                      }
                    }
                  }
                }
            `
        })
    });
    const{ data } = await response.json();
    return data;
}

export async function singleSeriesQuery(series = null) {
    const first = ( series && series === typeof "string") ? 1 : 9999;
    const variables = { first, series };

    const response = await fetch(import.meta.env.WORDPRESS_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.WORDPRESS_API_TOKEN}`,
            'User-Agent': 'CROSS-FETCH'
        },
        body: JSON.stringify({
            query: `
                query GetSeries($first: Int!, $series: [String]) {
                    allSeries(first: $first, where: {hideEmpty: true, orderby: COUNT, slug: $series}) {
                        nodes {
                            name
                            slug
                            count
                            description
                        }
                    }
                }
            `,
            variables
        })
    });

    const { data } = await response.json();

    return data;
}

export async function singleTopicQuery(category) {
    const first = ( category && category === typeof "string") ? 1 : 9999;
    const variables = { first, category };

    const response = await fetch(import.meta.env.WORDPRESS_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.WORDPRESS_API_TOKEN}`,
            'User-Agent': 'CROSS-FETCH'
        },
        body: JSON.stringify({
            query: `
                query GetTopics($first: Int!, $category: [String]) {
                  categories(first: $first, where: { hideEmpty: true, orderby: COUNT, slug: $category }) {
                    nodes {
                      name
                      slug
                      count
                      description
                    }
                  }
                }
            `,
            variables
        })
    });

    const { data } = await response.json();

    return data;
}

export async function singleTagQuery(tag) {
    const first = ( tag && tag === typeof "string") ? 1 : 9999;
    const variables = { first, tag };

    const response = await fetch(import.meta.env.WORDPRESS_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.WORDPRESS_API_TOKEN}`,
            'User-Agent': 'CROSS-FETCH'
        },
        body: JSON.stringify({
            query: `
                query GetTags($first: Int!, $tag: [String]) {
                  tags(first: $first, where: {hideEmpty: true, orderby: COUNT, slug: $tag}) {
                    nodes {
                      name
                      slug
                      count
                      description
                    }
                  }
                }
            `,
            variables
        })
    });

    const { data } = await response.json();

    return data;
}


export async function singleStoryQuery(story) {
    const variables = { story };

    const response = await fetch(import.meta.env.WORDPRESS_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.WORDPRESS_API_TOKEN}`,
            'User-Agent': 'CROSS-FETCH'
        },
        body: JSON.stringify({
            query: `
                query GetStory($story: String!) {
                  stories(where: {slug: [$story]}) {
                    nodes {
                      name
                      slug
                      description
                      images {
                          cover {
                            sourceUrl
                            sourceFile
                            mediaDetails {
                              width
                              height
                              x
                              y
                              color
                            }
                          }
                          banner {
                            sourceUrl
                            sourceFile
                            mediaDetails {
                              width
                              height
                              x
                              y
                              color
                            }
                          }
                          background {
                            sourceUrl
                            sourceFile
                            mediaDetails {
                              width
                              height
                              x
                              y
                              color
                            }
                          }
                      }
                      chapters(where: {orderby: {field: MENU_ORDER, order: ASC}}) {
                        nodes {
                          title
                          slug
                          date
                          wordCount
                        }
                      }
                    }
                  }
                }
            `,
            variables
        })
    });

    const { data } = await response.json();

    return data;
}

export async function singlePageQuery(slug) {
    const variables = { slug };

    const response = await fetch(import.meta.env.WORDPRESS_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.WORDPRESS_API_TOKEN}`,
            'User-Agent': 'CROSS-FETCH'
        },
        body: JSON.stringify({
            query: `
                query GetPage($slug: String!) {
                  pages(where: {name: $slug}) {
                    nodes {
                      title
                      slug
                      license
                      content
                    }
                  }
                }
            `,
            variables
        })
    });

    const { data } = await response.json();

    return data;
}

export async function singlePostQuery(slug) {
    const variables = { slug };

    const response = await fetch(import.meta.env.WORDPRESS_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.WORDPRESS_API_TOKEN}`,
            'User-Agent': 'CROSS-FETCH'
        },
        body: JSON.stringify({
            query: `
                query GetPost($slug: String!) {
                  posts(where: {name: $slug}) {
                    nodes {
                      title
                      subtitle
                      slug
                      shortlink
                      date
                      dateGmt
                      readingTime
                      series
                      license
                      excerpt
                      toc
                      author {
                        node {
                          name
                        }
                      }
                      previousPost {
                        title
                        slug
                        series
                      }
                      nextPost {
                        title
                        slug
                        series
                      }
                      categories {
                        nodes {
                          name
                          slug
                          count
                        }
                      }
                      tags {
                        nodes {
                          name
                          slug
                          count
                        }
                      }
                      featuredImage {
                        node {
                          sourceUrl
                          sourceFile
                          mediaDetails {
                            width
                            height
                            x
                            y
                            color
                          }
                        }
                      }
                      content
                    }
                  }
                }
            `,
            variables
        })
    });

    const { data } = await response.json();

    return data;
}

export async function singleChapterQuery(slug) {
    const variables = { slug };

    const response = await fetch(import.meta.env.WORDPRESS_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.WORDPRESS_API_TOKEN}`,
            'User-Agent': 'CROSS-FETCH'
        },
        body: JSON.stringify({
            query: `
                query GetChapter($slug: String) {
                  chapters(where: {name: $slug}) {
                    nodes {
                      title
                      slug
                      date
                      dateGmt
                      content
                      license
                      previousPost {
                        title
                        slug
                      }
                      nextPost {
                        title
                        slug
                      }
                      story {
                        name
                        slug
                        images {
                          cover {
                            sourceUrl
                            sourceFile
                            mediaDetails {
                              width
                              height
                              x
                              y
                              color
                            }
                          }
                          banner {
                            sourceUrl
                            sourceFile
                            mediaDetails {
                              width
                              height
                              x
                              y
                              color
                            }
                          }
                          background {
                            sourceUrl
                            sourceFile
                            mediaDetails {
                              width
                              height
                              x
                              y
                              color
                            }
                          }
                        }
                      }
                      editorBlocks(flat: false) {
                              clientId
                              blockEditorCategoryName
                              cssClassNames
                              isDynamic
                              name
                              renderedHtml
                              type
                              ... on CoreParagraph {
                                attributes {
                                  cssClassName
                                  content
                                }
                                renderedHtml
                              }
                              ... on CoreEmbed {
                                attributes {
                                  url
                                  type
                                  className
                                  caption
                                  align
                                }
                              }
                              ... on CoreImage {
                                attributes {
                                  src
                                  width
                                  height
                                  aspectRatio
                                  className
                                  cssClassName
                                  alt
                                  align
                                  caption
                                  href
                                  linkClass
                                  linkDestination
                                  linkTarget
                                  metadata
                                  scale
                                  sizeSlug
                                  style
                                  title
                                  url
                                }
                              }
                              ... on CoreQuote {
                                attributes {
                                  align
                                  citation
                                  className
                                  cssClassName
                                  metadata
                                  textColor
                                  value
                                }
                              }
                              ... on AcfAlert {
                                name
                                attributes {
                                  data
                                }
                                innerBlocks {
                                  renderedHtml
                                  name
                                }
                              }
                              ... on CoreList {
                                attributes {
                                  cssClassName
                                  className
                                  metadata
                                  ordered
                                  start
                                  values
                                }
                              }
                              ... on AcfBookmark {
                                name
                                renderedHtml
                                clientId
                              }
                            }
                    }
                  }
                }
            `,
            variables
        })
    });

    const { data } = await response.json();

    return data;
}

export async function allTagsQuery(){
    const response = await fetch(import.meta.env.WORDPRESS_API_URL, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.WORDPRESS_API_TOKEN}`,
            'User-Agent': 'CROSS-FETCH'
        },
        body: JSON.stringify({
            query: `
                query allTags {
                  tags(first: 9999, where: {hideEmpty: true, orderby: COUNT}) {
                    nodes {
                      name
                      slug
                      count
                    }
                  }
                }
            `
        })
    });
    const{ data } = await response.json();
    return data;
}

export async function allCategoriesQuery(){
    const response = await fetch(import.meta.env.WORDPRESS_API_URL, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.WORDPRESS_API_TOKEN}`,
            'User-Agent': 'CROSS-FETCH'
        },
        body: JSON.stringify({
            query: `
                query allCategories {
                  categories(first: 9999, where: {hideEmpty: true, orderby: COUNT}) {
                    nodes {
                      name
                      slug
                      count
                    }
                  }
                }
            `
        })
    });
    const{ data } = await response.json();
    return data;
}

export async function allSeriesQuery(){
    const response = await fetch(import.meta.env.WORDPRESS_API_URL, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.WORDPRESS_API_TOKEN}`,
            'User-Agent': 'CROSS-FETCH'
        },
        body: JSON.stringify({
            query: `
                query allSeries {
                  allSeries(first: 9999, where: {hideEmpty: true, orderby: COUNT}) {
                    nodes {
                      name
                      slug
                      count
                    }
                  }
                }
            `
        })
    });
    const{ data } = await response.json();
    return data;
}

export async function wpVersionQuery(){
    const response = await fetch(import.meta.env.WORDPRESS_API_URL, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.WORDPRESS_API_TOKEN}`,
            'User-Agent': 'CROSS-FETCH'
        },
        body: JSON.stringify({
            query: `{
                wp
            }
            `
        })
    });
    const{ data } = await response.json();
    return data;
}






export async function allStorySlugsQuery() {
    const query = `
        {
          stories(first: 9999, where: {hideEmpty: true}) {
            nodes {
              slug
            }
          }
        }
      `;

    const response = await fetch(import.meta.env.WORDPRESS_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.WORDPRESS_API_TOKEN}`,
            'User-Agent': 'CROSS-FETCH'
        },
        body: JSON.stringify({ query }),
    });

    const result = await response.json();
    return result.data;
}

export async function allChapterSlugsQuery() {
    const query = `
        {
          chapters(first: 9999) {
            nodes {
              slug
              story {
                slug
              }
            }
          }
        }
      `;

    const response = await fetch(import.meta.env.WORDPRESS_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.WORDPRESS_API_TOKEN}`,
            'User-Agent': 'CROSS-FETCH'
        },
        body: JSON.stringify({ query }),
    });

    const result = await response.json();
    return result.data;
}

export async function allSeriesSlugsQuery() {
    const query = `
        {
          allSeries(first: 9999, where: {hideEmpty: true}) {
            nodes {
              slug
            }
          }
        }
      `;

    const response = await fetch(import.meta.env.WORDPRESS_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.WORDPRESS_API_TOKEN}`,
            'User-Agent': 'CROSS-FETCH'
        },
        body: JSON.stringify({ query }),
    });

    const result = await response.json();
    return result.data;
}

export async function allPostSlugsQuery() {
    const query = `
        {
          posts(first: 9999) {
            nodes {
              slug
              series
            }
          }
        }
      `;

    const response = await fetch(import.meta.env.WORDPRESS_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.WORDPRESS_API_TOKEN}`,
            'User-Agent': 'CROSS-FETCH'
        },
        body: JSON.stringify({ query }),
    });

    const result = await response.json();
    return result.data;
}

export async function allPageSlugsQuery() {
    const query = `
        {
          pages(first: 9999) {
            nodes {
              slug
            }
          }
        }
      `;

    const response = await fetch(import.meta.env.WORDPRESS_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.WORDPRESS_API_TOKEN}`,
            'User-Agent': 'CROSS-FETCH'
        },
        body: JSON.stringify({ query }),
    });

    const result = await response.json();
    return result.data;
}

export async function allTagSlugsQuery() {
    const query = `
        {
          tags(first: 9999, where: {hideEmpty: true}) {
            nodes {
              slug
            }
          }
        }
      `;

    const response = await fetch(import.meta.env.WORDPRESS_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.WORDPRESS_API_TOKEN}`,
            'User-Agent': 'CROSS-FETCH'
        },
        body: JSON.stringify({ query }),
    });

    const result = await response.json();
    return result.data;
}

export async function allTopicSlugsQuery() {
    const query = `
        {
          categories(first: 9999, where: {hideEmpty: true}) {
            nodes {
              slug
            }
          }
        }
      `;

    const response = await fetch(import.meta.env.WORDPRESS_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.WORDPRESS_API_TOKEN}`,
            'User-Agent': 'CROSS-FETCH'
        },
        body: JSON.stringify({ query }),
    });

    const result = await response.json();
    return result.data;
}


export async function portfolioQuery() {
    const query = `
        query portfolioQuery {
          portfolio {
            nodes {
              sourceUrl
              sourceFile
              mediaDetails {
                width
                height
                x
                y
                color
              }
            }
          }
        }
      `;

    const response = await fetch(import.meta.env.WORDPRESS_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.WORDPRESS_API_TOKEN}`,
            'User-Agent': 'CROSS-FETCH'
        },
        body: JSON.stringify({ query }),
    });

    const result = await response.json();
    return result.data;
}

export async function bookshelfQuery() {
    const query = `
        query BookshelfQuery {
          bookshelf {
            nodes {
              title
              description
              link
              url
              author
              added
              published
              status
              site {
                domain
                icon {
                  sourceFile
                  sourceUrl
                  mediaDetails {
                    width
                    height
                    x
                    y
                    color
                  }
                }
              }
              cover {
                sourceFile
                sourceUrl
                mediaDetails {
                  width
                  height
                  x
                  y
                  color
                }
              }
            }
          }
        }
      `;

    const response = await fetch(import.meta.env.WORDPRESS_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.WORDPRESS_API_TOKEN}`,
            'User-Agent': 'CROSS-FETCH'
        },
        body: JSON.stringify({ query }),
    });

    const result = await response.json();
    return result.data.bookshelf.nodes;
}

export async function headQuery(url) {
    const variables = { url };

    const response = await fetch(import.meta.env.WORDPRESS_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.WORDPRESS_API_TOKEN}`,
            'User-Agent': 'CROSS-FETCH'
        },
        body: JSON.stringify({
            query: `
                query GetHead($url: String!) {
                  head(url: $url)
                }
            `,
            variables
        })
    });

    const { data } = await response.json();

    return data;
}

export async function fetchTwitchToken() {
    const cache = new NodeCache({ stdTTL: 2592000 }); // Cache for 1 month
    const cacheKey = `twitch_token`;
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
        return JSON.parse(cachedData);
    }

    const body = {
        client_id: import.meta.env.TWITCH_CLIENT_ID,
        client_secret: import.meta.env.TWITCH_CLIENT_SECRET,
        grant_type: 'client_credentials'
    };
    const urlEncodedData = new URLSearchParams(body).toString();

    const response = await fetch(`https://id.twitch.tv/oauth2/token`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: urlEncodedData
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.statusText}`);
    }

    const data = await response.json();
    cache.set(cacheKey, JSON.stringify(data));

    return data.access_token;
}