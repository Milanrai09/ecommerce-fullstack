import { getUserInfo, removeUser, editUserApi, createProduct } from "../api.js";

const adminScreen = {
  after_render: () => {
    document.querySelector('.listUser').addEventListener('click', () => {
      openModal('userListModal');
    });
    document.querySelector('.addProduct').addEventListener('click', () => {
      openModal('addProductModal');
    });

    // Add event listeners for close buttons
    document.querySelectorAll('.close-button').forEach(button => {
      button.addEventListener('click', () => {
        const modal = button.closest('.modal');
        if (modal) {
          closeModal(modal.id);
        }
      });
    });

    document.querySelectorAll('.remove-user').forEach((item) => {
      item.addEventListener('click', async (e) => {
        e.preventDefault();
        try {
          await removeUser(e.target.dataset.id);
          openModal('userListModal');
        } catch (error) {
          console.error('Error removing user:', error);
          showNotification('Failed to remove user', 'error');
        }
      });
    });

    document.querySelectorAll('.promote-user').forEach((item) => {
      item.addEventListener('click', async (e) => {
        e.preventDefault();
        try {
          await editUserApi(e.target.dataset.id);
          openModal('userListModal');
        } catch (error) {
          console.error('Error promoting user:', error);
          showNotification('Failed to promote user', 'error');
        }
      });
    });

    document.getElementById('image').addEventListener('change', function(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
          const preview = document.getElementById('imagePreview');
          preview.src = e.target.result;
          preview.style.display = 'block';
        };
        reader.readAsDataURL(file);
      }
    });

    // Add product form submission handler
    const addProductForm = document.getElementById('addProductForm');
    addProductForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const formData = new FormData(addProductForm);
      const productData = Object.fromEntries(formData.entries());
      
      // Handle file input separately
      const fileInput = document.getElementById('image');
      if (fileInput.files.length > 0) {
        productData.image = fileInput.files[0];
      }

      try {
        const result = await createProduct(productData);
        console.log('Product created:', result);
        closeModal('addProductModal');
        showNotification('Product created successfully', 'success');
        // Optionally, update the product list or refresh the page
      } catch (error) {
        console.error('Error creating product:', error);
        showNotification(error.message, 'error');
      }
    });
  },

  render: async () => {
    const userInfoString = localStorage.getItem('ecommerceToken');
  
    let userInfo;
    try {
      userInfo = JSON.parse(userInfoString);
    } catch (error) {
      console.error('Error parsing user info:', error);
      userInfo = null;
    }
  
    const isAdmin = userInfo && (userInfo.idAdmin === true || userInfo.isAdmin === true);
  
    if (!isAdmin) {
      return `
        <div class="unauthorized-access">
          <h2>Unauthorized Access</h2>
          <p>You are not authorized to access this page. Only administrators can view this content.</p>
        </div>
      `;
    }
    return `
    
      <div class="adminPanel">
        <div class="listUser">User List</div>
        <div class="addProduct">Add Product</div>
        <div class="listProduct"><a href="/adminPanel/updateProduct" data-link>Product List</a></div>
        <div class="listOrder"><a href="/adminPanel/updateOrder" data-link>Order List</a></div>
      </div>
      ${await getUserListModal()}
      ${getAddProductModal()}
    `;
  }
};

async function getUserListModal() {
  try {
    const getUserRes = await getUserInfo();
    const users = getUserRes?.data || [];

    return `
      <div id="userListModal" class="modal">
        <h2>User List</h2>
        <button class="close-button">x</button>
        <div class="user-list">
          ${users.length > 0 ? users.map(user => `
            <div class="user-item">
              <p>ID: ${user._id}</p>
              <p>Name: ${user.name}</p>
              <p>Email: ${user.email}</p>
              <p>Is Admin: ${user.isAdmin}</p>
              <p>Is Super Admin: ${user.isSuperAdmin}</p>
              <button class="promote-user" data-id="${user._id}">Promote</button>
              <button class="remove-user" data-id="${user._id}">Remove</button>
            </div>
          `).join('') : '<p>No users found.</p>'}
        </div>
      </div>
    `;
  } catch (error) {
    console.error('Error in getUserListModal:', error);
    return `
      <div id="userListModal" class="modal">
        <h2>User List</h2>
        <button class="close-button">x</button>
        <p>Error loading users. Please try again later.</p>
      </div>
    `;
  }
}

function getAddProductModal() {
  return `
    <div id="addProductModal" class="modal">
      <h2>Add Product</h2>
      <button class="close-button">x</button>
      <form id="addProductForm">
        <label for="name">Product Name:</label>
        <input type="text" id="name" name="name" required minlength="3" maxlength="100">

        <label for="description">Product Description:</label>
        <textarea id="description" name="description" required minlength="10" maxlength="1000"></textarea>

        <label for="price">Price:</label>
        <input type="number" id="price" name="price" required min="0" step="0.01">

        <label for="countInStock">Count In Stock:</label>
        <input type="number" id="countInStock" name="countInStock" required min="0" step="1">

        <label for="image">Image:</label>
        <input type="file" id="image" name="image" accept="image/*" required>
        <img id="imagePreview" src="#" alt="Image preview" style="display:none; max-width: 200px; max-height: 200px;">

        <label for="category">Category:</label>
        <select id="category" name="category" required>
          <option value="">Select a category</option>
          <option value="Fashion">Fashion</option>
          <option value="Smart-Phone">Smart-Phone</option>
          <option value="Laptop">Laptop</option>
          <option value="HeadPhone">HeadPhone</option>
        </select>

        <label for="brand">Brand:</label>
        <input type="text" id="brand" name="brand" required>

        <div class="form-actions">
          <button type="submit">Submit</button>

        </div>
      </form>
    </div>
  `;
}
function openModal(modalId) {
  // Close any open modal first
  const openModal = document.querySelector('.modal.show');
  if (openModal) {
    closeModal(openModal.id);
  }

  // Open the requested modal
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('show');
    modal.style.display = 'block';
  } else {
    console.error(`Modal with id ${modalId} not found`);
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('show');
    modal.style.display = 'none';
  } else {
    console.error(`Modal with id ${modalId} not found`);
  }
}



export default adminScreen;