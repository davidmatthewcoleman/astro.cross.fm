async function fetchReviewedBooks() {
    const response = await fetch('https://api.crossrambles.com/v1/reviewed', {
        method: 'GET'
    });
    const data = await response.json();
    return data;
}

export { fetchReviewedBooks };