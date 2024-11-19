async function fetchReviewedBooks() {
    const response = await fetch('https://cross.fm/wp-json/wp/v2/reviewed', {
        method: 'GET'
    });
    const data = await response.json();
    return data;
}

export { fetchReviewedBooks };