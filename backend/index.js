require("dotenv").config();
const express = require('express');
const app = express();
const port = process.env.PORT;
const cors = require('cors');
const userRouter = require('./routes/userRoute');
const productRouter = require('./routes/productRoute');
const adminRouter = require('./routes/adminRoute');
const orderRouter = require('./routes/orderRoute');
const cartRoute = require('./routes/cartRoute');
const { dbConnect} = require('./config/database');
const bodyParser = require('body-parser');
const path = require('path');
const cookieParser = require('cookie-parser');

app.use(cors());

dbConnect()

 

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use('/api/users', userRouter);
app.use('/api/product', productRouter);
app.use('/api/admin', adminRouter);
app.use('/api/order', orderRouter);
app.use('/api/cart', cartRoute);

app.use(express.static(path.join(__dirname, '../frontend/src')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', async(req, res) => {
 try {
    await dbConnect();
    // Your database query here
    res.json({ success: true, data: "Your data here" });
  } catch (error) {
    console.error('Database operation error:', error);
    if (error.name === 'MongooseServerSelectionError') {
      console.error('Failed to select a MongoDB server. Check your connection string and network settings.');
    }
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error', 
      details: error.message 
    });
  }
});



app.listen(port, () => {
  console.log('Hello !! The server is live ...', port);
});
