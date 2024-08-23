const Cart = require("../models/cartModel");
const { Product } = require("../models/productModel");
const { UserCart } = require("../models/userModel");

async function createCartApi(data){
    const { userId, productId, quantity } = data;

    try {

        let cart = await Cart.findOne({ user: userId });

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const itemPrice = product.price;

        if (!cart) {
            // If no cart exists, create a new one
            cart = new Cart({
                user: userId,
                items: [{ product: productId, quantity, totalPrice: itemPrice * quantity }]
            });
        } else {
            // If cart exists, check if the product is already in the cart
            const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);

            if (itemIndex > -1) {
                // If product is already in the cart, update the quantity and totalPrice
                cart.items[itemIndex].quantity += quantity;
                cart.items[itemIndex].totalPrice += itemPrice * quantity;
            } else {
                // If product is not in the cart, a it to the cart
                cart.items.push({ product: productId, quantity, totalPrice: itemPrice * quantity });
            }
        }

        // Save the cart
        const savedCart = await cart.save();
        return savedCart;
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}
async function updateCartApi(data){
    const { quantity } = data;

    try {
        const cart = await Cart.findOne({ user: req.params.userId });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const itemIndex = cart.items.findIndex(item => item.product.toString() === req.params.productId);

        if (itemIndex > -1) {
            const product = await Product.findById(req.params.productId);
            const itemPrice = product.price;
            
            cart.items[itemIndex].quantity = quantity;
            cart.items[itemIndex].totalPrice = itemPrice * quantity;
        } else {
            return res.status(404).json({ message: 'Item not found in cart' });
        }

        const updatedCart = await cart.save();
        return updatedCart
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function quantityalter(frontquantityvalue, id) {
    try {
      const cart = await UserCart.findOne({ _id: id });
      if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
      }
  
      let alterquan = cart.items.find((item) => item.product._id.toString() === id);
      alterquan.quantity = frontquantityvalue;
      alterquan.price = alterquan.product.basePrice * frontquantityvalue;
  
      await cart.save();
  
      res.json({ message: 'Quantity and price updated successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }


  async function createCart(cartDetails) {
    try {
      const {
        productId,
        productPrice,
        userIdforCart,
        productName,
        productDescription,
        productImage,
        productCategory,
        productBrand,
      } = cartDetails;
  
      const saveCart = new Cart({
        user: userIdforCart,
        items: [
          {
            product: productId,
            quantity: 1, // Default to 1 if not provided
            totalPrice: productPrice,
            name: productName,
            description: productDescription,
            price: productPrice,
            image: productImage,
            category: productCategory,
            brand: productBrand,
          },
        ],
      });
  
      const cartSaved = await saveCart.save();
      if (cartSaved) {
        return {
          status: 201,
          data: { message: 'Cart saved successfully', cart: cartSaved },
        };
      } else {
        return {
          status: 500,
          data: { message: 'Cart creation failed' },
        };
      }
    } catch (error) {
      console.error('Error creating cart:', error);
      return {
        status: 500,
        data: { message: 'Cart creation failed', error: error.message },
      };
    }
  }



  async function getCartService(data) {
    try {
      const  id  = data;
      const carts = await Cart.find({ user: id });
      if (!carts) {
        console.log("carts not found");
      }
  
      const allOrderItems = [];
      for (const cart of carts) {
        const productIds = cart.items.map(item => item.product);
        const products = await Product.find({ _id: { $in: productIds } });
        const orderItems = cart.items.map(cartItem => {
          const product = products.find(p => p._id.toString() === cartItem.product.toString());
          return {
            name: product.name,
            qty: cartItem.quantity,
            image: product.image,
            price: product.price,
            product: product._id,
          };
        });
        allOrderItems.push(...orderItems);
      }
    
  
      return { status: 200, cart: allOrderItems };
    } catch (error) {
      console.error('Error getting cart:', error);
      return {
        status: 500,
        data: { message: 'Cart getting failed', error: error.message },
      };
    }
  }
  
  
async function getUserCart(userId) {
  try {
    const carts = await Cart.find({ user: userId });
    
    if (!carts || carts.length === 0) {
 
      return {
        status: 404,
        data: { message: 'No carts found for this user' },
      };
    }

    // Process the carts (if needed)
    const processedCarts = carts.map(cart => ({
      _id: cart._id,
      user: cart.user,
      items: cart.items.map(item => ({
        product: item.product,
        quantity: item.quantity,
        totalPrice: item.totalPrice,
        name: item.name,
        description: item.description,
        price: item.price,
        image: item.image,
        category: item.category,
        brand: item.brand,
      })),
    }));

    return {
      status: 200,
      data: processedCarts,
    };
  } catch (error) {
    console.error('Error getting carts:', error);
    return {
      status: 500,
      data: { message: 'Error retrieving carts', error: error.message },
    };
  }
}
module.exports = {
    createCartApi,
    updateCartApi,
    quantityalter,
    createCart,
    getCartService,
    getUserCart,
}

