export async function navQuery(){
    const siteNavQueryRes = await fetch(import.meta.env.WORDPRESS_API_URL, {
        method: 'post', 
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.WORDPRESS_API_TOKEN}`
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
                generalSettings {
                    title
                    url
                    description
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
            'Authorization': `Bearer ${import.meta.env.WORDPRESS_API_TOKEN}`
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

export async function blogQuery(first, after = null) {
    const variables = { first, after };

    try {
        const response = await fetch(import.meta.env.WORDPRESS_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${import.meta.env.WORDPRESS_API_TOKEN}`
            },
            body: JSON.stringify({
                query: `
                  query GetPaginatedPosts($first: Int!, $after: String) {
                    posts(first: $first, after: $after, where: { stickyPosts: true }) {
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
                'Authorization': `Bearer ${import.meta.env.WORDPRESS_API_TOKEN}`
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

export async function storiesQuery(first, after = null) {
    const variables = { first, after };

    try {
        const response = await fetch(import.meta.env.WORDPRESS_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${import.meta.env.WORDPRESS_API_TOKEN}`
            },
            body: JSON.stringify({
                query: `
                  query GetPaginatedStories($first: Int!, $after: String) {
                      stories(first: $first, after: $after) {
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
                'Authorization': `Bearer ${import.meta.env.WORDPRESS_API_TOKEN}`
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
                'Authorization': `Bearer ${import.meta.env.WORDPRESS_API_TOKEN}`
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
                'Authorization': `Bearer ${import.meta.env.WORDPRESS_API_TOKEN}`
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
            'Authorization': `Bearer ${import.meta.env.WORDPRESS_API_TOKEN}`
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
            'Authorization': `Bearer ${import.meta.env.WORDPRESS_API_TOKEN}`
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

export async function singleSeriesQuery(series) {
    const variables = { series };

    const response = await fetch(import.meta.env.WORDPRESS_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.WORDPRESS_API_TOKEN}`
        },
        body: JSON.stringify({
            query: `
                query GetSeries($series: String!) {
                    allSeries(where: { slug: [$series] }) {
                        nodes {
                            name
                            slug
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
    const variables = { category };

    const response = await fetch(import.meta.env.WORDPRESS_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.WORDPRESS_API_TOKEN}`
        },
        body: JSON.stringify({
            query: `
                query GetTopics($category: String!) {
                  categories(where: {slug: [$category]}) {
                    nodes {
                      name
                      slug
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
    const variables = { tag };

    const response = await fetch(import.meta.env.WORDPRESS_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.WORDPRESS_API_TOKEN}`
        },
        body: JSON.stringify({
            query: `
                query GetTags($tag: String!) {
                  tags(where: {slug: [$tag]}) {
                    nodes {
                      name
                      slug
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
            'Authorization': `Bearer ${import.meta.env.WORDPRESS_API_TOKEN}`
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
            'Authorization': `Bearer ${import.meta.env.WORDPRESS_API_TOKEN}`
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
            'Authorization': `Bearer ${import.meta.env.WORDPRESS_API_TOKEN}`
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
            'Authorization': `Bearer ${import.meta.env.WORDPRESS_API_TOKEN}`
        },
        body: JSON.stringify({
            query: `
                query GetChapter($slug: String!) {
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
                    }
                  }
                }
            `,
            variables
        })
    });

    const { data } = await response.json();

    console.log('Data: ', data);

    return data;
}

export async function allTagsQuery(){
    const response = await fetch(import.meta.env.WORDPRESS_API_URL, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.WORDPRESS_API_TOKEN}`
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
            'Authorization': `Bearer ${import.meta.env.WORDPRESS_API_TOKEN}`
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
            'Authorization': `Bearer ${import.meta.env.WORDPRESS_API_TOKEN}`
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
            'Authorization': `Bearer ${import.meta.env.WORDPRESS_API_TOKEN}`
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
            'Authorization': `Bearer ${import.meta.env.WORDPRESS_API_TOKEN}`
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
            'Authorization': `Bearer ${import.meta.env.WORDPRESS_API_TOKEN}`
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
            'Authorization': `Bearer ${import.meta.env.WORDPRESS_API_TOKEN}`
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
            'Authorization': `Bearer ${import.meta.env.WORDPRESS_API_TOKEN}`
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
            'Authorization': `Bearer ${import.meta.env.WORDPRESS_API_TOKEN}`
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
            'Authorization': `Bearer ${import.meta.env.WORDPRESS_API_TOKEN}`
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
            'Authorization': `Bearer ${import.meta.env.WORDPRESS_API_TOKEN}`
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
            'Authorization': `Bearer ${import.meta.env.WORDPRESS_API_TOKEN}`
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
            'Authorization': `Bearer ${import.meta.env.WORDPRESS_API_TOKEN}`
        },
        body: JSON.stringify({ query }),
    });

    const result = await response.json();
    return result.data;
}

export async function headQuery(url) {
    const variables = { url };

    const response = await fetch(import.meta.env.WORDPRESS_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.WORDPRESS_API_TOKEN}`
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