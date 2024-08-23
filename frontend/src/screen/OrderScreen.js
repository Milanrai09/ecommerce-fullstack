import { getOrderList, cancelUserOrder } from "../api.js";

const UpdateOrder = {
  after_render: async () => {
    document.querySelectorAll('.cancel-button').forEach(button => {
      button.addEventListener('click', async (e) => {
        const orderId = e.target.id;
        if (confirm('Are you sure you want to cancel this order?')) {
          const cancelRes = await cancelUserOrder(orderId);
          if (cancelRes.status === 200) {
            e.target.textContent = 'Cancelled';
            e.target.disabled = true;
          }
        }
      });
    });
  },

  render: async () => {
    const orders = await getOrderList();
    
    let orderHtml = '';
    
    orders.forEach(order => {
      orderHtml += `
        <div class="order-container">
          <p>Status: ${order.status}</p>
          <p>Total Price: $${order.totalPrice.toFixed(2)}</p>
          <div class="order-items">
            ${order.orderItems.map(item => `
              <div class="product-container">
                <img src="${item.image}" alt="${item.name}" class="product-image">
                <div class="product-details">
                  <h3 class="product-name">${item.name}</h3>
                  <p class="product-price">Price: $${item.price.toFixed(2)}</p>
                  <p class="product-quantity">Quantity: ${item.qty}</p>
                  <p class="product-total">Total: $${(item.price * item.qty).toFixed(2)}</p>
                </div>
              </div>
            `).join('')}
          </div>

          <button id="${order._id}" class="cancel-button" data-order-id="${order._id}" ${order.status === 'CANCELLED' ? 'disabled' : ''}>
            ${order.status === 'CANCELLED' ? 'Cancelled' : 'Cancel Order'}
          </button>
        </div>
      `;
    });

    return `
      <div class="orders-list">
        ${orderHtml}
      </div>
    `;
  }
};

export default UpdateOrder;