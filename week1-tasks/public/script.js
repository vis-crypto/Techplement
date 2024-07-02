document.addEventListener('DOMContentLoaded', function () {
  const quoteText = document.getElementById('quote-text');
  const quoteAuthor = document.getElementById('quote-author');
  const newQuoteButton = document.getElementById('new-quote-button');
  const searchButton = document.getElementById('search-button');
  const authorInput = document.getElementById('author-input');
  const searchResults = document.getElementById('search-results');

  async function fetchRandomQuote() {
    try {
      const response = await fetch('/api/random-quote');
      const data = await response.json();
      console.log('Fetched quote:', data); // Log the fetched quote
      quoteText.textContent = data.text;
      quoteAuthor.textContent = data.author ? `- ${data.author}` : '- Unknown';
    } catch (error) {
      console.error('Error fetching random quote:', error);
      quoteText.textContent = 'Error fetching quote';
      quoteAuthor.textContent = '';
    }
  }

  async function searchQuotesByAuthor(author) {
    try {
      const response = await fetch(`/api/quotes/search?author=${encodeURIComponent(author)}`);
      const data = await response.json();
      searchResults.innerHTML = '';

      if (data.length === 0) {
        searchResults.textContent = 'No quotes found for the specified author.';
      } else {
        data.forEach(quote => {
          const quoteElement = document.createElement('p');
          quoteElement.textContent = `${quote.content} - ${quote.author}`;
          searchResults.appendChild(quoteElement);
        });
      }
    } catch (error) {
      console.error('Error searching quotes:', error);
      searchResults.textContent = 'Error searching quotes';
    }
  }

  newQuoteButton.addEventListener('click', fetchRandomQuote);
  searchButton.addEventListener('click', () => {
    const author = authorInput.value.trim();
    if (author) {
      searchQuotesByAuthor(author);
    }
  });

  // Fetch an initial random quote when the page loads
  fetchRandomQuote();
});
