const Cart = require("../models/cartModel");
const { UserCart } = require("../models/userModel");
const { createCart, updateCartApi, quantityalter, getUserCart ,getCartService} = require("../services/cartService");


async function getCart(req, res) {
    try {
        const result = await getUserCart(req.params.id);
        res.status(result.status).json(result.data);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

async function updateCart(req,res){
    try{
        const { quantity } = req.body;
        const update = quantityalter(quantity,id)
        res.status(200).json(update)

    } catch(error){
        res.status(500).json({message:error.message})
    }

}


async function deleteCart(req,res){
    try{
    const cart = await Cart.findOne({ user: req.params.userId });

    if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
    }

    const itemIndex = cart.items.findIndex(item => item.product.toString() === req.params.productId);

    if (itemIndex > -1) {
        cart.items.splice(itemIndex, 1);
    } else {
        return res.status(404).json({ message: 'Item not found in cart' });
    }

    const updatedCart = await cart.save();
    res.json(updatedCart);
    }catch(error){
        res.status(500).json({message:error.message})
    }
}

async function createCarts(req,res){
    try{
    const cart = await createCart(req.body)

    if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
    }
    res.status(200).json({message:'sucussfull creating cart'})
    }catch(error){
        res.status(500).json({message:error.message})
    }
}


async function removeCart(req,res){
    try{
   
    const cart = await Cart.findByIdAndDelete(req.params.id)
    if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
    }
    res.status(200).json({message:'sucussfull creating cart'})
    }catch(error){
        res.status(500).json({message:error.message})
    }
}




async function quantityUpdate (req,res){
    try{
    const { cartId } = req.params;
    const { productId, quantity } = req.body;

    // Find the cart by ID
    const cart = await Cart.findById(cartId);

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Find the item in the cart
    const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);

    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Product not found in cart' });
    }

    // Update the quantity
    cart.items[itemIndex].quantity = quantity;

    // Recalculate total price if necessary
    // This assumes you have a price field in your items
    cart.totalPrice = cart.items.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);

    // Save the updated cart
    await cart.save();

    res.json({ message: 'Quantity updated successfully', cart });
  } catch (error) {
    console.error('Error updating quantity:', error);
    res.status(500).json({ message: 'Error updating quantity', error: error.message });
  }
}


module.exports = {
    getCart,
    createCarts,
    updateCart,
    deleteCart,
    removeCart,
    quantityUpdate

}