require("dotenv").config();
const express = require('express');
const app = express();
const port = process.env.PORT
const cors = require('cors');
// const userRouter = require('./routes/userRoute');
// const productRouter = require('./routes/productRoute');
// const adminRouter = require('./routes/adminRoute');
// const orderRouter = require('./routes/orderRoute');
// const cartRoute  = require('./routes/cartRoute')
require('./config/database');
const bodyParser = require('body-parser');
const path = require('path');
const cookieParser = require('cookie-parser');


// CORS function for individual route handling
const allowCors = fn => async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', 'https://ecommerce-fullstack-frontend-ng82us7y5-milanrai09s-projects.vercel.app/');
  // Alternatively, allow any origin
  // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  return await fn(req, res);
};

// Example usage with route handlers
const userRouter = allowCors(require('./routes/userRoute'));
const productRouter = allowCors(require('./routes/productRoute'));
const adminRouter = allowCors(require('./routes/adminRoute'));
const orderRouter = allowCors(require('./routes/orderRoute'));
const cartRoute = allowCors(require('./routes/cartRoute'));




app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());



app.use('/api/users' , userRouter);
app.use('/api/product',productRouter)
app.use('/api/admin',adminRouter)
app.use('/api/order',orderRouter)
app.use('/api/cart',cartRoute)



app.use(express.static(path.join(__dirname, '../frontend/src')));


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/',(req, res) => {
    res.send('hello ecommerce');
});

app.listen(port, () => {
    console.log('Hello !! The server is live ...',port);
});

