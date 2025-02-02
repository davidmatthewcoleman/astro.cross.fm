const fetcher = (url) => {
    console.log("Fetching:", url);
    return fetch(url).then((res) => res.json());
};

export default fetcher;