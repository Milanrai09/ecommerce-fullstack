import { getProductApi, addToCart } from '../api.js';

const HeadphoneScreen = {
  after_render: () => {
    const addtocartButtons = document.querySelectorAll('#addcart');
    if (addtocartButtons) {
      addtocartButtons.forEach((button) => {
        button.addEventListener('click', async () => {
          const productId = button.dataset.productId;
          const productPrice = button.dataset.productPrice;
          const productName = button.dataset.productName;
          const productDescription = button.dataset.productDescription;
          const productImage = button.dataset.productImage;
          const productCategory = button.dataset.productCategory;
          const productBrand = button.dataset.productBrand;

          const userId = localStorage.getItem('ecommerceToken');
          let userIdforCart;
          if (userId) {
            const parsedData = JSON.parse(userId);
            console.log(parsedData.id);
            userIdforCart = parsedData && parsedData.id;
          }

          const addtocartData = {
            productId,
            productPrice,
            userIdforCart,
            productName,
            productDescription,
            productImage,
            productCategory,
            productBrand
          };

          const cartResponse = await addToCart(addtocartData);
          console.log(cartResponse);
        });
      });
    }
  },

  render: async () => {
    const productApi = await getProductApi();
    let productsHtml = '';

    if (productApi) {
      const filteredProducts = productApi.filter(
        (product) => product.category === 'HeadPhone'
      );

      productsHtml = filteredProducts.map((product) => `
        <div class="product-first">
          <img src="${product.image}" alt="${product.name}">
          <a href="/headPhones/${product._id}" data-link>
            <h2>${product.name}</h2>
          </a>
          <h4>${product.description}</h4>
          <ul>
            <li>Price: $${product.price}</li>
            <li>Category: ${product.category}</li>
            <li>Brand: ${product.brand}</li>
          </ul>
          <div class="cart-sec">
            <button id="addcart" 
              data-product-id="${product._id}" 
              data-product-price="${product.price}"
              data-product-name="${product.name}"
              data-product-description="${product.description}"
              data-product-image="${product.image}"
              data-product-category="${product.category}"
              data-product-brand="${product.brand}"
            >Add to Cart</button>
          </div>
        </div>
      `).join('');
    }

    return `
      <div class="product-list-home">
        ${productsHtml}
      </div>
    `;
  },
};

export default HeadphoneScreen;