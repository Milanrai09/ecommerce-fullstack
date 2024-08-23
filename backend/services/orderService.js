const Order = require("../models/orderModel");

async function getOrderService(data) {
    try {
      const { id } = data; // This should be the user ID
  
      // Find all orders for this user
      const orders = await Order.find({ user: id });
  
      if (!orders || orders.length === 0) {
        return { status: 404, data: { message: "No orders found for this user" } };
      }
  
      // Format the orders to include only the specified product details
      const formattedOrders = orders.map(order => ({
        _id: order._id,
        orderItems: order.orderItems.map(item => ({
            documentId: order._id,
          name: item.name,
          qty: item.qty,
          image: item.image,
          price: item.price
        })),
        totalPrice: order.totalPrice,
        status: order.status,
        createdAt: order.createdAt
      }));
  
      return { status: 200, data: formattedOrders };
    } catch (error) {
      console.error('Error getting orders:', error);
      return {
        status: 500,
        data: { message: 'Error fetching orders', error: error.message },
      };
    }
  }
module.exports = {

    getOrderService,
}

