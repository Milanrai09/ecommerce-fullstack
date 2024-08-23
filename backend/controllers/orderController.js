const Cart = require('../models/cartModel');
const Order = require('../models/orderModel');
const { Product } = require('../models/productModel');
const { UserCart } = require('../models/userModel');
const mongoose = require('mongoose');
const { getOrderService } = require('../services/orderService');
const savedOrder = async (req, res) => {
  try {
    const userId = req.params.userid;
    const { shipping, payment } = req.body;

    console.log('Request body:', req.body);


    if (!shipping || !payment) {
      return res.status(400).json({ message: 'Shipping and payment information are required' });
    }

    // Validate shipping fields
    const requiredShippingFields = ['address', 'city', 'postalCode', 'country'];
    for (const field of requiredShippingFields) {
      if (!shipping[field]) {
        return res.status(400).json({ message: `Shipping ${field} is required` });
      }
    }

    // Validate payment fields
    if (!payment.cardNumber || !payment.expiryDate || !payment.cvv) {
      return res.status(400).json({ message: 'All payment details are required' });
    }

    // 1. Fetch the user's cart
    const carts = await Cart.find({ user: userId });
    if (!carts || carts.length === 0) {
      console.log("Carts not found or empty");
      return res.status(400).json({ message: 'No items in cart' });
    }

    console.log('Fetched carts:', carts);

    const orderItems = [];
    for (const cart of carts) {
      const productIds = cart.items.map(item => item.product);
      const products = await Product.find({ _id: { $in: productIds } });
      
      console.log('Found products:', products);

      const cartOrderItems = cart.items.map(cartItem => {
        const product = products.find(p => p._id.toString() === cartItem.product.toString());
        if (!product) {
          console.log(`Product not found for cartItem:`, cartItem);
          return null;
        }
        return {
          name: product.name,
          qty: cartItem.quantity,
          image: product.image,
          price: product.price,
          product: product._id,
        };
      }).filter(item => item !== null);

      orderItems.push(...cartOrderItems);
    }

    console.log('All order items:', orderItems);

    if (orderItems.length === 0) {
      console.log("No valid order items");
      return res.status(400).json({ message: 'No valid items to order' });
    }

    // 4. Calculate prices
    const itemsPrice = orderItems.reduce((acc, item) => acc + item.price * item.qty, 0);
    const taxPrice = itemsPrice * 0.15; // Assuming 15% tax
    const shippingPrice = itemsPrice > 100 ? 0 : 10; // Free shipping for orders over $100
    const totalPrice = itemsPrice + taxPrice + shippingPrice;

    console.log('Calculated prices:', { itemsPrice, taxPrice, shippingPrice, totalPrice });

    // 5. Create the order
    const order = new Order({
      user: userId,
      orderItems,
      shippingAddress: {
        address: shipping.address,
        city: shipping.city,
        postalCode: shipping.postalCode,
        country: shipping.country
      },
      paymentMethod: 'Credit Card', // You might want to adjust this based on your needs
      paymentResult: {
        id: payment.cardNumber.slice(-4), // Last 4 digits of card number
        status: 'Pending',
        update_time: new Date().toISOString(),
        email_address: shipping.name // You might want to adjust this
      },
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      isPaid: false,
      isDelivered: false,
      status: 'PENDING'
    });

    console.log('Order object before save:', order);


    const createdOrder = await order.save();

    console.log('Created order:', createdOrder);

    // 7. Clear the cart
    await Cart.deleteMany({ user: userId });

    res.status(201).json(createdOrder);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Error creating order', error: error.message });
  }
};
// Function to get all orders for a user
const getUserOrders = async (req, res) => {
  try {
      const orders = await getOrderService(req.params)
      res.json(orders);
  } catch (error) {
      console.error('Error fetching user orders:', error);
      res.status(500).json({ message: 'Error fetching orders', error: error.message });
  }
};


const updateOrder = async (req, res) => {
  const { id, input } = req.body;
  try {
    const order = await Order.findById(id);
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Check if the input status is valid
    if (!['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'].includes(input)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    order.status = input;
    await order.save();

    res.status(200).json({ message: 'Update successful',status:200, order });

  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};



module.exports = {
    getUserOrders,
    savedOrder,
    updateOrder,
};



