import { searchProducts } from "../api.js";

const SearchScreen = {
  after_render: () => {
    // You can add any post-render logic here if needed
  },

  render: async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('q') || '';

    try {
      const products = await searchProducts(query);
      console.log(products);

      const productList = products.map(product => `
        <div class="search-product-item">
          <div class="search-product-image">
            <img src="/${product.image}" alt="${product.name}">
          </div>
          <div class="search-product-details">
            <a href="/${product._id}" data-link>
              <h2>${product.name}</h2>
            </a>
            <p class="search-product-description">${product.description}</p>
            <p class="search-product-price">$${product.price.toFixed(2)}</p>
            <p class="search-product-brand">Brand: ${product.brand}</p>
          </div>
        </div>
      `).join('');

      return `
        <div class="search-container">
          <h1 class="search-title">Search Results for: "${query}"</h1>
          ${products.length > 0
            ? `<div class="search-product-list">${productList}</div>`
            : '<p class="no-results">No products found matching your search.</p>'
          }
        </div>
      `;
    } catch (error) {
      console.error('Error rendering search results:', error);
      return `
        <div class="search-container">
          <h1 class="search-title">Search Results for: "${query}"</h1>
          <p class="error-message">An error occurred while fetching products. Please try again later.</p>
        </div>
      `;
    }
  }
};

export default SearchScreen;