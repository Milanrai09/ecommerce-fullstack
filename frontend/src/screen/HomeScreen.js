import { getProductApi, addToCart } from '../api.js';

const HomeScreen = {
  after_render: () => {


    const addtocartButton = document.querySelectorAll('#addcart')
    if(addtocartButton){
      addtocartButton.forEach((button) => {
        button.addEventListener('click', async() => {
          const productId = button.dataset.productId;
          const productPrice = button.dataset.productPrice;
          const productName = button.dataset.productName;
          const productDescription = button.dataset.productDescription;
          const productImage = button.dataset.productImage;
          const productCategory = button.dataset.productCategory;
          const productBrand = button.dataset.productBrand;

          const userId = localStorage.getItem('ecommerceToken')
          let userIdforCart
          if (userId) {
            const parsedData = JSON.parse(userId);
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
          }

          const cartResponse = await addToCart(addtocartData);
        });
      });
    }
  },

  render: async () => {
    const product = await getProductApi()

    return `

      <div class="product-list-home">
        ${product.map(item => `
          <div class="product-first">
            <ul>
              <li>
                <img src="${item.image}" alt="${item.name}">
              </li>
              <li>
               <a href="/${item._id}" data-link>${item.name}</a>
              </li>
              <li>
                <h4>${item.description}</h4>
              </li>
            </ul>
            <div class="cart-sec">
              <ul>
                <li>
                  <button id="addcart" 
                    data-product-id="${item._id}" 
                    data-product-price="${item.price}"
                    data-product-name="${item.name}"
                    data-product-description="${item.description}"
                    data-product-image="${item.image}"
                    data-product-category="${item.category}"
                    data-product-brand="${item.brand}"
                  >cart</button>
                </li>
              </ul>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }
};

export default HomeScreen;