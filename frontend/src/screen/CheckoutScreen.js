import { createOrder } from '../api.js';

const CheckoutScreen = {
  render: async () => {
    return `
      <div class="checkout-container">
        <div class="checkout-form">
          <h2>Shipping Address</h2>
          <form id="checkout-form">
            <label for="name">Name:</label>
            <input type="text" id="name" name="name" required>
            <label for="address">Address:</label>
            <input type="text" id="address" name="address" required>
            <label for="city">City:</label>
            <input type="text" id="city" name="city" required>
            <label for="postalCode">Postal Code:</label>
            <input type="text" id="postalCode" name="postalCode" required>
            <label for="country">Country:</label>
            <input type="text" id="country" name="country" required>
            <label for="paymentMethod">Payment Method:</label>
            <select id="paymentMethod" name="paymentMethod" required>
              <option value="PayPal">PayPal</option>
              <option value="Credit Card">Credit Card</option>
              <option value="Cash on Delivery">Cash on Delivery</option>
            </select>
            <label for="cardNumber">Card Number:</label>
            <input type="text" id="cardNumber" name="cardNumber" required>
            <label for="expiryDate">Expiry Date:</label>
            <input type="text" id="expiryDate" name="expiryDate" required>
            <label for="cvv">CVV:</label>
            <input type="text" id="cvv" name="cvv" required>
            <button type="submit">Create Order</button>
          </form>
        </div>
      </div>
    `;
  },
  after_render: async () => {
    document.getElementById('checkout-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const orderData = {
        shipping: {
          name: formData.get('name'),
          address: formData.get('address'),
          city: formData.get('city'),
          postalCode: formData.get('postalCode'),
          country: formData.get('country'),
        },
        payment: {
          cardNumber: formData.get('cardNumber'),
          expiryDate: formData.get('expiryDate'),
          cvv: formData.get('cvv'),
        },
      };
      console.log(orderData);
      const response = await createOrder(orderData);
      if (response.error) {
        console.error('response error checkout');
      } else {
        // document.location.hash = `/order/${response.order._id}`;
      }
    });
  },
};

export default CheckoutScreen;