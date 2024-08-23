import { getOrderList, updateOrder, cancelUserOrder } from "../api.js";

const UpdateOrder = {
    render: async () => {
      const orders = await getOrderList();

      let orderHtml = '';
      orders.forEach(order => {
        orderHtml += `
          <div class="order-container" data-order-id="${order._id}">
            <p>Status: ${order.status}</p>
            <p>Total Price: $${order.totalPrice.toFixed(2)}</p>
            <p class="is-paid">Paid: ${order.isPaid ? 'Yes' : 'No'}</p>
            <p class="is-delivered">Delivered: ${order.isDelivered ? 'Yes' : 'No'}</p>
            <div class="order-items">
              ${order.orderItems.map(item => `
                <div class="product-container">
                  <img src="${item.image}" alt="${item.name}"  style="max-width: 200px;">
                  <div class="product-details">
                    <h3 class="product-name">${item.name}</h3>
                    <p class="product-price">Price: $${item.price.toFixed(2)}</p>
                    <p class="product-quantity">Quantity: ${item.qty}</p>
                    <p class="product-total">Total: $${(item.price * item.qty).toFixed(2)}</p>
                  </div>
                </div>
              `).join('')}
            </div>
            <button class="edit-button">Edit</button>
            <button class="cancel-button" ${order.status === 'CANCELLED' ? 'disabled' : ''}>
              ${order.status === 'CANCELLED' ? 'Cancelled' : 'Cancel Order'}
            </button>
          </div>
          </div>
        `;
      });
  
      orderHtml += `
        <div id="editModal" class="modal" style="display: none;">
          <div class="modal-content">
            <span class="close" id='close'>&times;</span>
            <form id="editForm">
              <label for="status">Status:</label>
              <select id="status">
                <option value="PENDING">Pending</option>
                <option value="PROCESSING">Processing</option>
                <option value="SHIPPED">Shipped</option>
                <option value="DELIVERED">Delivered</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
              <label for="isPaid">Paid:</label>
              <input type="checkbox" id="isPaid">
              <label for="isDelivered">Delivered:</label>
              <input type="checkbox" id="isDelivered">
              <button type="submit">Save</button>
            </form>
          </div>
        </div>
      `;
  
      return `
        <div class="orders-list">
          ${orderHtml}
        </div>
      `;
    },
  
    after_render: async () => {
      document.querySelectorAll('.cancel-button').forEach(button => {
        button.addEventListener('click', async (e) => {
          const orderId = e.target.closest('.order-container').dataset.orderId;
          const clickedId = e.target.id
          if (confirm('Are you sure you want to cancel this order?')) {
            const cancelRes = await cancelUserOrder(orderId);
            if (cancelRes.status === 200) {
              e.target.textContent = 'Cancelled';
              e.target.disabled = true;
            }
          }
        });
      });
  
      let currentOrderId = null;
      document.querySelectorAll('.edit-button').forEach(button => {
        button.addEventListener('click', (e) => {
          const orderContainer = e.target.closest('.order-container');
          currentOrderId = orderContainer.dataset.orderId;
          
          // Get the current status
          const statusText = orderContainer.querySelector('p:first-child').textContent;
          const status = statusText.split(': ')[1];
          
          // Set the status in the form
          document.getElementById('status').value = status;
          
          // Set isPaid and isDelivered checkboxes
          // You might need to adjust this based on how you're displaying this information in the order container
          const isPaidElement = orderContainer.querySelector('.is-paid');
          const isDeliveredElement = orderContainer.querySelector('.is-delivered');
          
          if (isPaidElement) {
            document.getElementById('isPaid').checked = isPaidElement.textContent.includes('Yes');
          }
          
          if (isDeliveredElement) {
            document.getElementById('isDelivered').checked = isDeliveredElement.textContent.includes('Yes');
          }
          
          // Show the modal
          document.getElementById('editModal').style.display = 'block';
        });
      });
  
      // Add event listener for the close button
      document.querySelector('#close').addEventListener('click', () => {
        document.getElementById('editModal').style.display = 'none';
      });


      document.getElementById('editForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!currentOrderId) {
          console.error('No order selected for editing');
          return;
        }
      
        try {
          const updatedOrder = {
            orderId: currentOrderId,
            status: document.getElementById('status').value,
            isPaid: document.getElementById('isPaid').checked,
            isDelivered: document.getElementById('isDelivered').checked
          };
          console.log(updatedOrder);
      
          await updateOrder(updatedOrder);
      
          const editModal = document.getElementById('editModal');
          if (editModal) {
            editModal.style.display = 'none';
          } else {
            console.warn('Edit modal element not found');
          }
      
          if (typeof UpdateOrder === 'object' && typeof UpdateOrder.render === 'function') {
            const ordersListElement = document.querySelector('.orders-list');
            if (contentElement) {
              contentElement.innerHTML = await UpdateOrder.render();
              
              // Only call afterRender if it exists
              if (typeof UpdateOrder.afterRender === 'function') {
                await UpdateOrder.afterRender();
              }
            } else {
              console.error('Element with id "content" not found');
            }
          } else {
            console.error('UpdateOrder object or its render method is not defined');
          }
        } catch (error) {
          console.error('Error updating order:', error);
          // Here you might want to show an error message to the user
        }
      });
    }}
  
  export default UpdateOrder;