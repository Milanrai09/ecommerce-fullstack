import { getProductApi, updateProduct, deleteProduct } from "../api.js";

const UpdateProduct = {
  render: async () => {
    const products = await getProductApi();
    return `
      <div class="product-list">
        ${products.map(product => `
          <div class="product-item" data-product-id="${product._id}">
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <p>Brand: ${product.brand}</p>
            <p>Price: $${product.price}</p>
            <p>In Stock: ${product.countInStock}</p>
            <p>Category: ${product.category}</p>
            <img src="${product.image}" alt="${product.name}" style="max-width: 200px;">
            <button id="${product._id}" class="edit-button">Edit</button>
            <button id="${product._id}" class="delete-button">Delete</button>
          </div>
        `).join('')}
      </div>

      <div id="editModal" class="modal" style="display: none;">
        <div class="modal-content">
          <span class="close" id='close'>&times;</span>
          <form id="editForm">
            <input type="hidden" id="productId">
            <label for="name">Name:</label>
            <input type="text" id="name" required>
            <label for="description">Description:</label>
            <textarea id="description" required></textarea>
            <label for="brand">Brand:</label>
            <input type="text" id="brand" required>
            <label for="price">Price:</label>
            <input type="number" id="price" step="0.01" required>
            <label for="countInStock">Count in Stock:</label>
            <input type="number" id="countInStock" required>
            <label for="category">Category:</label>
            <select id="category" name="category" required>
              <option value="">Select a category</option>
              <option value="Fashion">Fashion</option>
              <option value="Smart-Phone">Smart-Phone</option>
              <option value="Laptop">Laptop</option>
              <option value="HeadPhone">HeadPhone</option>
            </select>
  
            <button type="submit">Save</button>
          </form>
        </div>
      </div>
    `;
  },
  after_render: async () => {
    let currentProductId = null;
    const editButtons = document.querySelectorAll('.edit-button');
    editButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const productItem = e.target.closest('.product-item');
        const productId = productItem.dataset.productId;
        currentProductId = e.target.id;
        document.getElementById('productId').value = productId;
        document.getElementById('name').value = productItem.querySelector('h3').textContent;
        document.getElementById('description').value = productItem.querySelector('p').textContent;
        document.getElementById('brand').value = productItem.querySelector('p:nth-child(3)').textContent.split(': ')[1];
        document.getElementById('price').value = productItem.querySelector('p:nth-child(4)').textContent.split('$')[1];
        document.getElementById('countInStock').value = productItem.querySelector('p:nth-child(5)').textContent.split(': ')[1];
        document.getElementById('category').value = productItem.querySelector('p:nth-child(6)').textContent.split(': ')[1];
        
        document.getElementById('editModal').style.display = 'block';
      });
    });

    document.querySelector('#close').addEventListener('click', () => {
      document.getElementById('editModal').style.display = 'none';
    });

    const deleteButtons = document.querySelectorAll('.delete-button');
    deleteButtons.forEach(button => {
      button.addEventListener('click', async (e) => {
        currentProductId = e.target.id;
        if (confirm('Are you sure you want to delete this product?')) {
          await deleteProduct(currentProductId);
          e.target.closest('.product-item').remove();
        }
      });
    });

    document.getElementById('editForm').addEventListener('submit', async (e) => {
      e.preventDefault();

      if(!currentProductId){
        console.error('No product selected for editing');
        return;
      }

      const updatedProduct = {
        productId: currentProductId,
        name: document.getElementById('name').value,
        description: document.getElementById('description').value,
        brand: document.getElementById('brand').value,
        price: parseFloat(document.getElementById('price').value),
        countInStock: parseInt(document.getElementById('countInStock').value),
        category: document.getElementById('category').value,
        image: document.getElementById('image').value
      };

      await updateProduct(updatedProduct);
      document.getElementById('editModal').style.display = 'none';

      const productItem = document.querySelector(`.product-item[data-product-id="${currentProductId}"]`);
      if (productItem) {
        productItem.querySelector('h3').textContent = updatedProduct.name;
        productItem.querySelector('p').textContent = updatedProduct.description;
        productItem.querySelector('p:nth-child(3)').textContent = `Brand: ${updatedProduct.brand}`;
        productItem.querySelector('p:nth-child(4)').textContent = `Price: $${updatedProduct.price}`;
        productItem.querySelector('p:nth-child(5)').textContent = `In Stock: ${updatedProduct.countInStock}`;
        productItem.querySelector('p:nth-child(6)').textContent = `Category: ${updatedProduct.category}`;
        productItem.querySelector('img').src = updatedProduct.image;
        productItem.querySelector('img').alt = updatedProduct.name;
      }
    });
  }
};

export default UpdateProduct;