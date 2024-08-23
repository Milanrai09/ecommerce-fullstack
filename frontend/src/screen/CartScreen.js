import { getCart, removeCart, updateQuantity } from "../api.js";

const CartScreen = {
  render: async () => {
    const cartsResponse = await getCart();


    return `

      <div class="product-list-home">
      ${cartsResponse.cart.length === 0 ? '<div>No carts found</div>' : cartsResponse.cart.map(cart => `
        <div class="cart-container">
          ${cart.items.length === 0 ? '<div>This cart is empty</div>' : cart.items.map((item) => `
            <div class="product-first">
              <ul>
                <li>
                  <img src="${item.image}" alt="${item.name}">
                </li>
                <li>
                  <h3>${item.name}</h3>
                </li>
                <li>
                  <h4>Price: ${item.price}</h4>
                </li>
                <li>
                  <h4>Brand: ${item.brand}</h4>
                </li>
                <li>
                  <h4>Category: ${item.category}</h4>
                </li>
                <li>
                  <h4>Description: ${item.description}</h4>
                </li>
                <li>
                  <h4>Quantity: ${item.quantity}</h4>
                </li>
                <li>
                  <h4>Total Price: ${item.totalPrice}</h4>
                </li>
              </ul>
    
              <div class="cart-sec">
                <ul>
                  <li>
                    <div class="product-qty">
                      Qty: 
                      <button class="quantity-btn minus" data-cart-id="${cart._id}" data-product-id="${item.product}">-</button>
                      <span class="quantity-display">${item.quantity}</span>
                      <button class="quantity-btn plus" data-cart-id="${cart._id}" data-product-id="${item.product}">+</button>
                    </div>
                  </li>
                  <li>
                    <button class="remove-button" data-cart-id="${cart._id}" data-product-id="${item.product}">Remove</button>
                  </li>
                </ul>
              </div>
            </div>

          `).join('')}
          
          </div>
          
          `).join('')}
          
          </div>
          <div class='checkout-link'> 
            <a  href="/cart/checkout" data-link>CheckOut</a>
          
          </div>

    `;
  },
  
  after_render: () => {
    document.querySelectorAll('.remove-button').forEach(button => {
      button.addEventListener('click', async () => {
        const cartId = button.getAttribute('data-cart-id');
        const productId = button.getAttribute('data-product-id');
        await removeCart(cartId, productId);
        // Refresh the cart display after removal
        document.getElementById('main-container').innerHTML = await CartScreen.render();
        CartScreen.after_render();
      });
    });

    document.querySelectorAll('.quantity-btn').forEach(button => {
      button.addEventListener('click', async () => {
        const cartId = button.getAttribute('data-cart-id');
        const productId = button.getAttribute('data-product-id');
        const isIncrement = button.classList.contains('plus');
        const quantityDisplay = button.parentElement.querySelector('.quantity-display');
        let newQuantity = parseInt(quantityDisplay.textContent) + (isIncrement ? 1 : -1);
        
        if (newQuantity > 0) {
          await updateQuantity(cartId, productId, newQuantity);
          quantityDisplay.textContent = newQuantity;
        }
      });
    });
  }
}

export default CartScreen;