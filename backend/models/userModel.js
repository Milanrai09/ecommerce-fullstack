const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,  // Ensure the name is required
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,  // Ensure the email is required
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true  // Ensure the password is required
    },
    isAdmin: { type: Boolean, default: false }, // New field to indicate admin status
    isSuperAdmin:{type:Boolean,default:false},


  });


const CartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      products: [
        {
          productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
          },
          price: {
            type: Number,
            required: true,
          },
        },
      ],

    
    
    
})


const User = mongoose.model('userCollection', UserSchema);
const UserCart = mongoose.model('userCart',CartSchema)
module.exports = {
    User,
    UserCart,

};


