const Order = require("../models/orderModel");
const { Product } = require("../models/productModel");
const {User} = require("../models/userModel");

async function getUser(req,res){
    try {
        const user = await userService.getUser(req.params.id);
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}async function getAllUser(req, res) {
    try {
        const users = await User.find({});
        if (users.length > 0) {
            res.json({ message: 'Users found', data: users });
        } else {
            res.json({ message: 'No users found' });
        }
    } catch (error) {
        console.error(error); // Log the error
        res.status(500).json({ message: 'Internal Server Error' });
    }
}


async function addProduct(req,res){
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


async function removeProduct(req,res){
    try {
        console.log('hello',req.params.id)
        await Product.findByIdAndDelete(req.params.id);
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


async function makeAdmin(req,res){
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.isAdmin = true;
        const updatedUser = await user.save();
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


async function demoteAdmin (req,res){
    try {
        const user = await User.findById(req.params.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.isAdmin = false;
        const updatedUser = await user.save();
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}



async function getAllOrders(req,res){
    try {
        const orders = await Order.find();
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}



async function getProduct(req,res){
    try {
    console.log("Fetching articles...");
    const productResponse = await Product.find({});
    console.log("Articles retrieved:", productResponse);
    res.status(200).json(productResponse);
  } catch (error) {
    console.error("Error retrieving articles:", error);
    res.status(500).json({ error: 'Failed to retrieve articles' });
  }
}




async function removeUser(req,res){
    try{
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json({message:'removed user succesfull'})

        
    }catch(error){
        res.status(500).json({error:error.message})
    }
}



async function updateUser (req,res){
    try{
        console.log('hello')
        const id = req.params.editUserId
        const update = await User.findById(id)
    if(update){

        update.isAdmin = false;
    }

        await update.save()
        res.status(200).json({message:'update sucessfull'})

    }catch(error){
        res.status(500).json({error:error.message})
    }
}



const cancelOrder = async (req, res) => {
    const { id } = req.params;
    console.log(id)
    try {
      const order = await Order.findById(id);
      
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }
  
      order.status = 'CANCELLED'
  

      await order.save();
  
      res.status(200).json({ message: 'Update successful',status:200, order });
  
    } catch (error) {
      console.error('Error updating order:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  const AdminupdateOrder = async (req, res) => {
    try {
      const { updateOrder } = req.body;
      console.log(updateOrder)
      const OrderId = updateOrder.orderId
      const updatesOrder = await Order.findById(OrderId)
      if (!updatesOrder) {
        return res.status(404).json({ error: 'Order not found' });
      }

      updatesOrder.status = updateOrder.status
      updatesOrder.isPaid = updateOrder.isPaid
      updatesOrder.isDelivered = updateOrder.isDelivered
      await updatesOrder.save();
      res.status(200).json({ message: 'Order update successful' })
    } catch (error) {
      console.error('Error updating order:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }


  const updateProduct = async (req, res) => {
    try {
      const { updatedProducts } = req.body;
      console.log('hello',updatedProducts)
      const productId = updatedProducts.productId
      const updateProductsRes = await Product.findById(productId)
      if (!updateProductsRes) {
        return res.status(404).json({ error: 'Order not found' });
      }

      updateProductsRes.name = updatedProducts.name
      updateProductsRes.description=updatedProducts.description
      updateProductsRes.price = updatedProducts.price
      updateProductsRes.countInStock = updatedProducts.countInStock
      updateProductsRes.image=updatedProducts.image
      updateProductsRes.category =updatedProducts.category
      updateProductsRes.brand = updatedProducts.brand

      await updateProductsRes.save();
      res.status(200).json({ message: 'product update successful' })
    } catch (error) {
      console.error('Error updating product:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }












module.exports= {
    updateProduct,
    getUser,
    getAllOrders,
    removeProduct,
    makeAdmin,
    addProduct,
    demoteAdmin,
    updateUser,
    cancelOrder,
    getAllUser,
    getProduct,
    removeUser,
    AdminupdateOrder

}
