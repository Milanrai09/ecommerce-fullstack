import { getPaticularProduct, addToCart } from "../api.js";

const PaticularProductPage = {
    after_render: () => {
        console.log('Particular Product Page rendered');
        const addToCartButton = document.querySelector('#addcart');
        if (addToCartButton) {
            addToCartButton.addEventListener('click', async () => {
                const productId = addToCartButton.dataset.productId;
                const productPrice = addToCartButton.dataset.productPrice;
                const productName = addToCartButton.dataset.productName;
                const productDescription = addToCartButton.dataset.productDescription;
                const productImage = addToCartButton.dataset.productImage;
                const productCategory = addToCartButton.dataset.productCategory;
                const productBrand = addToCartButton.dataset.productBrand;

                const userId = localStorage.getItem('ecommerceToken');
                let userIdforCart;
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
                };

                try {
                    const cartResponse = await addToCart(addtocartData);
                    console.log('Product added to cart:', cartResponse);
                    // You can add a user notification here, e.g., alert('Product added to cart!');
                } catch (error) {
                    console.error('Error adding product to cart:', error);
                    // You can add error handling here, e.g., alert('Failed to add product to cart. Please try again.');
                }
            });
        }
    },
    render: async () => {
        const url = window.location.href;
        const id = url.split("/").pop();

        try {
            const product = await getPaticularProduct(id);
            
            if (!product) {
                return `<div class="error-message">Product not found</div>`;
            }

            return `
                <div class="product-detail-container">
                    <div class="product-image-container">
                        <img src="/${product.image}" alt="${product.name}" class="product-detail-image">
                    </div>
                    <div class="product-info">
                        <h1 class="product-name">${product.name}</h1>
                        <p class="product-description">${product.description}</p>
                        <p class="product-price">$${product.price.toFixed(2)}</p>
                        <p class="product-stock">In Stock: ${product.countInStock}</p>
                        <p class="product-category">Category: ${product.category}</p>
                        <p class="product-brand">Brand: ${product.brand}</p>
                        <button id="addcart" class="add-to-cart-btn"
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
            `;
        } catch (error) {
            console.error('Error fetching product:', error);
            return `<div class="error-message">Error loading product. Please try again later.</div>`;
        }
    }
};

export default PaticularProductPage;