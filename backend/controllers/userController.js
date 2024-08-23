const jwt = require('jsonwebtoken');
const userService = require('../services/userService');
const { User } = require('../models/userModel');


const secretKey = process.env.JWT_SECRET_KEY;



async function getUser(req, res) {
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
}

async function registerUser(req, res) {
    try {

        const { name, email } = req.body;
        const userCheck = await User.findOne({email})
        if(userCheck){
            return res.status(409).json({message:'user already exist'})
        }
        
        // Create the user
        const userResponse = await userService.createUser(req.body);

        if (userResponse.status === 201) {
            const token = jwt.sign({ id:userResponse.savedUsers._id, isAdmin:userResponse.savedUsers.isAdmin, isSuperAdmin:userResponse.savedUsers.isSuperAdmin}, secretKey, { expiresIn: '1h' });

            const sendData = {
                id:userResponse.savedUsers._id,
                 isAdmin:userResponse.savedUsers.isAdmin,
                  isSuperAdmin:userResponse.savedUsers.isSuperAdmin,
                token         }
            // Set cookies
            res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
            // Send success response
            res.status(201).json({ message: 'Register successfully',sendData });
        } else {
            // Send error response based on user creation response
            res.status(userResponse.status).json(userResponse.data);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function loginUser(req, res) {
    try {
        const user = await userService.loginService(req.body);
        const { status, userData, message } = user;

        if (status.ok) {
            const tokens = userData.token;
            res.cookie('token', tokens, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production'
            });


            res.status(status.code).json({ message, userData });
        } else {
            console.log('Inside the user error response:', status);
            res.status(status.code).json({ message });
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: error.message });
    }
}


async function getCart(req, res) {
    const { userIdCart } = req.query;
    try {
        console.log("Fetching cart for userIdCart:", userIdCart);
        const cartProducts = await userService.getUserCarts(userIdCart);
        console.log("Cart products:", cartProducts);

        if (!cartProducts || cartProducts.length === 0) {
            return res.status(404).json({ message: "No cart products found for this user" });
        }

        const productDetails = await userService.getProductById(cartProducts);
        console.log("Product details:", productDetails);

        if (productDetails.status === 200) {
            res.status(200).json(productDetails.data);
        } else {
            res.status(productDetails.status).json(productDetails.data);
        }
    } catch (error) {
        console.error("Error in getCart:", error);
        res.status(500).json({ message: error.message });
    }
}

async function getAllUser(req,res){
    try{
        const users = await User.find();
        res.status(200).json(users);
    }
    catch(error){
        res.status(500).json({messag:error.message});
    }
}

async function userLogout(req,res){
    try{
        res.clearCookie('accessToken').json({ message: 'Logged out successfully' });

    }catch(error){
        res.status(500).json({message:error.message});
    }
}



async function getUserInfo (req, res)  {
    res.json({
        isLoggedIn: true,
        isAdmin: req.user.isAdmin,
        isSuperAdmin: req.user.isSuperAdmin,
        name: req.user.name,
        email: req.user.email
    });
};


async function addProductToCart (req,res){
    try{
        const addtoCartresponse = await userService.createCart(req.body)
        if(addtoCartresponse.status === 201){
            return res.status(200).json({message:'cart create succesfully'})
        }
    }catch(error){
        res.status(500).json({error:error.message})
    }
}
module.exports = {
    getUser,
    registerUser,
    loginUser,
    getCart,
    getAllUser,
    userLogout,
    getUserInfo,
    addProductToCart
    
};
