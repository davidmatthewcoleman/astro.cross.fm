class BookshelfBlock extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    async connectedCallback() {
        // Check localStorage for the selected view mode (default to list view)
        const initialViewMode = localStorage.getItem('viewMode') || 'list';

        const shadowRoot = this.shadowRoot;
        const container = document.createElement('div');
        container.id = 'next-app';
        shadowRoot.appendChild(container);

        try {
            // Fetch the Next.js app HTML
            const response = await fetch('https://next-app.cross.fm/bookshelf/' + initialViewMode);
            const htmlText = await response.text();

            // Parse the HTML content and extract the contents of the specific div
            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlText, 'text/html');
            const bookshelfContent = doc.querySelector('#bookshelf').innerHTML;

            // Fetch the CSS
            const cssResponse = await fetch('https://next-app.cross.fm/styles.css');
            const cssText = await cssResponse.text();

            // Create a style element and add the CSS text
            const style = document.createElement('style');
            style.textContent = cssText;
            shadowRoot.appendChild(style);

            // Inject the HTML content into the container
            container.innerHTML = bookshelfContent;
        } catch (error) {
            console.error('Error fetching HTML or CSS:', error);
        }
    }
}

customElements.define('bookshelf-block', BookshelfBlock);

const toggleButton = document.getElementById('toggleButton');
const bookshelfBlock = document.querySelector('bookshelf-block');
const cache = {};

// Function to fetch HTML content based on the view mode and cache it
async function fetchAndCacheHTML(viewMode) {
    const url = `https://next-app.cross.fm/bookshelf/${viewMode}`;

    try {
        const response = await fetch(url);
        htmlText = await response.text();

        // Parse the HTML content and extract the contents of the specific div
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlText, 'text/html');
        const bookshelfContent = doc.querySelector('#bookshelf').innerHTML;

        cache[viewMode] = bookshelfContent;
    } catch (error) {
        console.error(`Error fetching HTML for ${viewMode} view:`, error);
    }
}

// Check localStorage for the selected view mode (default to list view)
const initialViewMode = localStorage.getItem('viewMode') || 'list';

// Fetch and cache HTML content for both view modes
Promise.all(['list', 'grid'].map(fetchAndCacheHTML))
    .then(() => {
        // Set initial view mode
        bookshelfBlock.setAttribute('view-mode', initialViewMode);

        // Inject the HTML content into the container based on the initial view mode
        bookshelfBlock.shadowRoot.querySelector('#next-app').innerHTML = cache[initialViewMode];

        // Attach event listener to toggle button after fetching HTML content
        toggleButton.addEventListener('click', toggleViewMode);
    });

// Function to toggle view mode
function toggleViewMode() {
    const currentViewMode = bookshelfBlock.getAttribute('view-mode');
    const newViewMode = currentViewMode === 'list' ? 'grid' : 'list';

    // Update view mode attribute
    bookshelfBlock.setAttribute('view-mode', newViewMode);

    // Store the selected view mode in localStorage
    localStorage.setItem('viewMode', newViewMode);

    // Inject the HTML content into the container based on the selected view mode
    bookshelfBlock.shadowRoot.querySelector('#next-app').innerHTML = cache[newViewMode];
}