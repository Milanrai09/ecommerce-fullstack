// import Header from './components/HeaderComp.js';
// import Footer from './components/Footer.js';
// import HomeScreen from './screen/HomeScreen.js';
// import Error404Screen from './components/Error404Screen.js';
// import { currentUrl } from './utils.js';
// import loginScreen from './screen/LoginScreen.js';
// import RegisterScreen from './screen/RegisterScreen.js';
// import searchScreen from './screen/SearchScreen.js';
// import adminScreen from './screen/AdminScreen.js';
// import fashionScreen from './screen/FashionScreen.js';
// import SmartPhoneScreen from './screen/SmartPhoneScreen.js';
// import LaptopScreen from './screen/LaptopScreen.js';
// import HeadphoneScreen from './screen/HeadPhoneScreen.js';
// import orderScreen from './screen/OrderScreen.js';
// import CartScreen from './screen/CartScreen.js';
// import CheckoutScreen from './screen/CheckoutScreen.js';
// import UpdateProduct from './screen/UpdateProductScreen.js';
// import UpdateOrder from './screen/UpdateOrderScreen.js';
// import PaticularProductPage from './screen/PaticularProductPage.js';
// const routes = {
//   "/": HomeScreen,
//   "/login": loginScreen,
//   "/register": RegisterScreen,
//   "/search/:query": searchScreen,
//   "/adminPanel": adminScreen,
//   "/fashion": fashionScreen,
//   "/smartPhone": SmartPhoneScreen,
//   "/laptop": LaptopScreen,
//   "/headPhones": HeadphoneScreen,
//   "/orderlist": orderScreen,
//   "/cart": CartScreen,
//   "/cart/checkout": CheckoutScreen,
//   "/adminPanel/updateProduct": UpdateProduct,
//   "/adminPanel/updateOrder": UpdateOrder,
//   "/:id": PaticularProductPage,
//   "/fashion/:id": PaticularProductPage,
//   "/smartPhone/:id": PaticularProductPage,
//   "/laptop/:id": PaticularProductPage,
//   "/headPhones/:id": PaticularProductPage
// };


// const render = async () => {
//   let currentLocation = currentUrl();
//   let paramMatch = null;

//   const searchMatch = currentLocation.match(/^\/search\/(.+)/);
//   if (searchMatch) {
//     currentLocation = '/search/:query';
//   } else {
//     const specificRoutes = ['/', '/fashion', '/smartPhone', '/laptop', '/headPhones', 
//                             '/orderlist', '/cart', '/cart/checkout', '/adminPanel',
//                             '/login', '/register']; // Added login and register
//     if (!specificRoutes.includes(currentLocation)) {
//       paramMatch = currentLocation.match(/^\/?(.+)$/);
//       if (paramMatch) {
//         const parts = paramMatch[1].split('/');
//         if (parts.length === 2 && ['fashion', 'smartPhone', 'laptop', 'headPhones'].includes(parts[0])) {
//           currentLocation = `/${parts[0]}/:id`;
//         } else if (parts.length === 1 && !specificRoutes.includes('/' + parts[0])) {
//           currentLocation = '/:id';
//         }
//       }
//     }
//   }

//   const screen = routes[currentLocation] ? routes[currentLocation] : Error404Screen;

//   const header = document.getElementById('header_container');
//   if (header) header.innerHTML = await Header.render();
//   await Header.after_render();

//   const main = document.getElementById('main_container');
//   if (!screen.render) {
//     console.error('No render method found for the current screen');
//     return;
//   }

//   if (screen === searchScreen) {
//     main.innerHTML = await screen.render(searchMatch ? searchMatch[1] : '');
//   } else if (paramMatch && currentLocation.includes('/:id')) {
//     main.innerHTML = await screen.render(paramMatch[1]);
//   } else {
//     main.innerHTML = await screen.render();
//   }

//   if (screen.after_render) {
//     await screen.after_render();
//   } else {
//     console.warn('No after_render method found for the current screen');
//   }

//   const footer = document.getElementById('footer_container');
//   if (footer) footer.innerHTML = await Footer.render();
// };

// // Event listeners
// document.addEventListener('DOMContentLoaded', () => {
//   document.body.addEventListener('click', (e) => {
//     if (e.target.matches('[data-link]')) {
//       e.preventDefault();
//       navigateTo(e.target.href);
//     }
//   });
// });

// window.addEventListener("popstate", render);
// window.addEventListener('locationchange', render);

// // Navigate function
// const navigateTo = (url) => {
//   history.pushState(null, null, url);
//   render();
// };

// render();
import Header from './components/HeaderComp.js';
import Footer from './components/Footer.js';
import HomeScreen from './screen/HomeScreen.js';
import Error404Screen from './components/Error404Screen.js';
import { currentUrl } from './utils.js';
import loginScreen from './screen/LoginScreen.js';
import RegisterScreen from './screen/RegisterScreen.js';
import searchScreen from './screen/SearchScreen.js';
import adminScreen from './screen/AdminScreen.js';
import fashionScreen from './screen/FashionScreen.js';
import SmartPhoneScreen from './screen/SmartPhoneScreen.js';
import LaptopScreen from './screen/LaptopScreen.js';
import HeadphoneScreen from './screen/HeadPhoneScreen.js';
import orderScreen from './screen/OrderScreen.js';
import CartScreen from './screen/CartScreen.js';
import CheckoutScreen from './screen/CheckoutScreen.js';
import UpdateProduct from './screen/UpdateProductScreen.js';
import UpdateOrder from './screen/UpdateOrderScreen.js';
import PaticularProductPage from './screen/PaticularProductPage.js';

const routes = {
  "/": HomeScreen,
  "/login": loginScreen,
  "/register": RegisterScreen,
  "/search/:query": searchScreen,
  "/adminPanel": adminScreen,
  "/fashion": fashionScreen,
  "/smartPhone": SmartPhoneScreen,
  "/laptop": LaptopScreen,
  "/headPhones": HeadphoneScreen,
  "/orderlist": orderScreen,
  "/cart": CartScreen,
  "/cart/checkout": CheckoutScreen,
  "/adminPanel/updateProduct": UpdateProduct,
  "/adminPanel/updateOrder": UpdateOrder,
  "/:id": PaticularProductPage,
  "/fashion/:id": PaticularProductPage,
  "/smartPhone/:id": PaticularProductPage,
  "/laptop/:id": PaticularProductPage,
  "/headPhones/:id": PaticularProductPage
};

const render = async () => {
  let currentLocation = currentUrl();
  let paramMatch = null;
  let matchedRoute = null;

  // Check for exact matches first
  if (routes[currentLocation]) {
    matchedRoute = currentLocation;
  } else {
    // Check for parameterized routes
    for (const [route, handler] of Object.entries(routes)) {
      const regexRoute = new RegExp(`^${route.replace(/:[^\s/]+/g, '([\\w-]+)')}$`);
      const match = regexRoute.exec(currentLocation);
      if (match) {
        matchedRoute = route;
        paramMatch = match[1];
        break;
      }
    }
  }

  const screen = matchedRoute ? routes[matchedRoute] : Error404Screen;

  const header = document.getElementById('header_container');
  if (header) header.innerHTML = await Header.render();
  await Header.after_render();

  const main = document.getElementById('main_container');
  if (!screen.render) {
    console.error('No render method found for the current screen');
    return;
  }

  if (paramMatch) {
    main.innerHTML = await screen.render(paramMatch);
  } else {
    main.innerHTML = await screen.render();
  }

  if (screen.after_render) {
    await screen.after_render();
  } else {
    console.warn('No after_render method found for the current screen');
  }

  const footer = document.getElementById('footer_container');
  if (footer) footer.innerHTML = await Footer.render();
};

// Event listeners
window.addEventListener('popstate', render);
window.addEventListener('load', render);

// Navigate function
const navigateTo = (url) => {
  history.pushState(null, null, url);
  render();
};

// Attach click event listener to the document for navigation
document.addEventListener('click', (e) => {
  const link = e.target.closest('a');
  if (link && link.getAttribute('href').startsWith('/')) {
    e.preventDefault();
    navigateTo(link.getAttribute('href'));
  }
});
