import { getUserInfo } from "../api.js";

const Header = {
  after_render: () => {
    const searchButton = document.getElementById('search');
  const searchModal = document.getElementById('searchModal');
  const closeButtons = searchModal.querySelector('.close');

  if (searchButton && searchModal) {
    searchButton.addEventListener('click', () => {
      searchModal.style.display = 'block';
    });

    closeButtons.addEventListener('click', () => {
      searchModal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
      if (event.target === searchModal) {
        searchModal.style.display = 'none';
      }
    });
  } else {
    console.log('Search button or search modal not found');
  }



  const darkModeToggle = document.getElementById('darkModeToggle');
  if (darkModeToggle) {
    darkModeToggle.addEventListener('click', () => {
      if (localStorage.getItem('darkMode') === 'enabled') {
        localStorage.setItem('darkMode', 'disabled');
        document.body.classList.remove('dark-mode');
        darkModeToggle.textContent = '🌙';
      } else {
        localStorage.setItem('darkMode', 'enabled');
        document.body.classList.add('dark-mode');
        darkModeToggle.textContent = '☀️';
      }
    });
  }

  // Apply dark mode on page load if it was previously enabled
  if (localStorage.getItem('darkMode') === 'enabled') {
    document.body.classList.add('dark-mode');
  }
  // Handle form submission if needed
  const searchForm = document.getElementById('search-form');
  if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      // Handle search submission
      console.log('Search submitted:', document.getElementById('inputVal').value);
      searchModal.style.display = 'none';
    });
  }
    const profile = document.querySelector('.profile');
    if (profile) {
      profile.addEventListener('click', () => {
        const profileModal = document.getElementById('profileModalDiv');
        profileModal.style.display = 'block';
      });
    }

    const closeButton = document.querySelector('.close-button');
    if (closeButton) {
      closeButton.addEventListener('click', () => {
        const profileModal = document.getElementById('profileModalDiv');
        profileModal.style.display = 'none';
      });
    }

document.getElementById('search-form').addEventListener('submit',(e) => {
  e.preventDefault()

  const inputVal = document.getElementById('inputVal').value;
  window.history.pushState({}, '', `/search/${inputVal}`);
  window.dispatchEvent(new CustomEvent('locationchange'));

})



document.querySelector('#logoutButton').addEventListener('click',() => {
        localStorage.removeItem('ecommerceToken');
        window.location.href = '/login';

    })



    document.body.addEventListener('click', (e) => {
      if (e.target.matches('form[data-link]') || e.target.closest('form[data-link]')) {
        e.preventDefault();
        navigateTo(e.target.getAttribute('data-link') || e.target.closest('form[data-link]').getAttribute('data-link'));
      }
    });
  },

  render: async () => {
    let userInfo = false;
    const storedEcommerce = localStorage.getItem('ecommerceToken');
    let isAdmin = false;
    if (storedEcommerce) {
      const parsedData = JSON.parse(storedEcommerce);
      isAdmin = parsedData && parsedData.isAdmin;
      userInfo = true;
    }else{
        userInfo = false;
        isAdmin = false;

    }

    const userInformation = await getUserInfo();
    if (userInformation) {

      if (userInformation.isLoggedIn) {
        alert('Logged in');
      }
    } else {
      console.error('Error, userinfo is empty');
    }

    return `
    <div class="header-component">
        <div class="header-first">
          <a href="/" data-link>Logo</a>
        </div>

        ${!isAdmin ? 
          `<div class="login-register">
            <ul>
              <li>
                <a href="/login" data-link>Login</a>
              </li>
              <li>
                <a href="/register" data-link>Register</a>
              </li>
            </ul>
          </div>` : ''
        }

        <div class="header-second">
          <ul>
            <li>
              <a href="/fashion" data-link>Fashion</a>
            </li>
            <li>
              <a href="/smartPhone" data-link>Smart-Phone</a>
            </li>
            <li>
              <a href="/laptop" data-link>Laptop</a>
            </li>
            <li>
              <a href="/headPhones" data-link>Headphone</a>
            </li>
          </ul>
        </div>
        <div class="header-third">
        <ul>
          <li>
            <p id="search">Search</p>

          </li>
            ${userInfo ? `<a href="/cart" data-link>cart</a>` : ''}
            ${isAdmin ? 
              `<li>
                <a href="/adminPanel" data-link>Admin-Panel</a>
              </li>` : ''
            }

            <li>
              <button id="darkModeToggle" class="dark-mode-toggle">
                ${localStorage.getItem('darkMode') === 'enabled' ? '☀️' : '🌙'}
              </button>
            </li>


            <li>
              ${userInfo ? `<div class="profile">Profile</div>` : ''}
            </li>
          </ul>
        </div>
      </div>

      ${profileModal()}


<div id="searchModal" class="modal">
<div class="modal-content">
  <span class="close">&times;</span>
  <form class="search-form" id="search-form">
    <input type="text" id="inputVal" placeholder="Type to search...">
    <button type="submit">search</button>
  </form>
</div>
</div>
    `;
  }
};
function profileModal() {
  return `
    <div id="profileModalDiv" class="ProfileModal" style="display: none;">
      <h2>User List</h2>
      <button class="close-button">x</button>
      <h4>hello milan</h4>

      <div class="mainProfileFun">
        <a href="/orderlist" data-link>Order-List</a>
        <button id="logoutButton">Log-out</button>
      </div>
    </div>
  `;
}


function toggleModal(modalId) {
  // Get the previously open modal
  const previousModal = document.querySelector('.modal.show');

  // If the same modal is clicked again, close it
  if (previousModal && previousModal.id === modalId) {
    previousModal.classList.remove('show');
    return;
  }

  // If a different modal is clicked, keep the previous one open
  if (previousModal) {
    previousModal.classList.add('keep-open');
  }

  // Open the new modal
  const modal = document.getElementById(modalId);
  modal.classList.add('show');
}

function searchInputData(inputdata) {
  // Add your search logic here
  console.log('Searching for:', inputdata);
}

export default Header;