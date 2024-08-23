const { Product } = require("../models/productModel");
const {User,UserCart} = require( "../models/userModel");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const secretKey = process.env.JWT_SECRET_KEY;
const { v2: cloudinary } = require('cloudinary');
require('dotenv').config();

 async function getUser(id){
    return await User.findById(id);
}

 async function createUser(userData){
    const {name,email,password} = userData;
    const hashpassword = await bcrypt.hash(password,10);
    const userCheck = await User.findOne({email})
    if(userCheck){
        return {
            status: 409,
            data: { message: 'user alreay exist' },
        }
    }
    const user = new User({
        name:name,
        email:email,
        password:hashpassword,
        isAdmin:true,
        isSuperAdmin:true,


    });

    
    const savedUser = await user.save();
    if (savedUser) {
        return {
            status: 201,
            data: { message: 'Register successfully' },
            savedUsers:savedUser,
        };
    } else {
        return {
            status: 500,
            data: { message: 'User creation failed' },
        };
    }
}
async function loginService(loginData) {
    const { email, password } = loginData;
    try {
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return {
                status: 404,
                message: 'User not found'
            };
        }

        // Check if password is correct
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return {
                status: 401,
                message: 'Incorrect password'
            };
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, isAdmin: user.isAdmin, isSuperAdmin: user.isSuperAdmin },
            secretKey,
            { expiresIn: '1h' }
        );

        const userData = {
            isAdmin: user.isAdmin,
            id: user._id,
            isSuperAdmin: user.isSuperAdmin,
            token,
        };

        // Return user status, roles, and token
        return {
            status: { ok: true, code: 200 },
            userData,
            message: 'Login successful'
        };
    } catch (error) {
        console.error('Error in loginService:', error);
        return {
            status: { ok: false, code: 500 },
            message: 'Internal server error'
        };
    }
}
async function getUserCarts(userId) {
    try {
        const carts = await UserCart.find({ userId });
        if (carts.length > 0) {
            const allProducts = carts.map(cart => cart.products).flat();
            return allProducts;
        }
        throw new Error('No user carts found');
    } catch (error) {
        throw error;
    }
}

async function addProduct(productData, userId) {
    const product = new Product({
        ...productData,
        userId
    });

    try {
        const savedProduct = await product.save();
        return savedProduct;
    } catch (error) {
        throw error; // Re-throw for handling in the controller
    }
}


async function createCart(cartDetails) {
    try {
      const { productId,productPrice,userIdforCart} = cartDetails;
      const saveCart = new UserCart({
        userId: userIdforCart,
        products: [
          {
            productId: productId,
            price: productPrice,
          },
        ],
      });
  
      const cartSaved = await saveCart.save();
      if (cartSaved) {
        return {
          status: 201,
          data: { message: 'saved successfully' },
        };
      } else {

        return {
          status: 500,
          data: { message: 'cart creation failed' },
        };
      }
    } catch (error) {
      console.error(error);
      return {
        status: 500,
        data: { message: 'cart creation failed' },
      };
    }
  }



  async function getProductById(productsId) {
    try {
        console.log("Getting products for productsId:", productsId);
        if (!productsId || productsId.length === 0) {
            return {
                status: 404,
                data: { message: 'No product IDs provided' }
            };
        }

        // Extract all productIds from the input array
        const productIds = productsId.map(item => item.productId).filter(id => id);
        console.log("Extracted productIds:", productIds);

        if (productIds.length === 0) {
            return {
                status: 404,
                data: { message: 'No valid product IDs found' }
            };
        }

        // Find all products that match these ids
        const getproducts = await Product.find({ _id: { $in: productIds } });
        console.log("Found products:", getproducts);

        if (getproducts.length > 0) {
            return {
                status: 200,
                data: getproducts
            };
        } else {
            return {
                status: 404,
                data: { message: 'No products found for the given ids' }
            };
        }
    } catch (error) {
        console.error("Error in getProductById:", error);
        return {
            status: 500,
            data: { message: 'Getting the products by id failed' },
        };
    }
}async function removeCartService(id) {
    try {
        const result = await UserCart.findByIdAndDelete(id);
        
        if (!result) {
            return {
                status: 404,
                data: { message: 'Cart not found' }
            };
        }

        return {
            status: 200,
            data: { message: 'Cart successfully removed' }
        };

    } catch (error) {
        console.error("Error in removing cart:", error);
        return {
            status: 500,
            data: { message: 'Error removing the cart' }
        };
    }
}

module.exports = {
    getUser,
    createUser,
    loginService,
    getUserCarts,
    addProduct,
    createCart,
    getProductById,
    removeCartService,
}
