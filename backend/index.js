require("dotenv").config(); // Load environment variables
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;   
 // Use default port if not set
const cors = require('cors'); // Import the cors package

// Route imports (assuming correct file paths)
const orderRouter = require('./routes/orderRoute');
const userRouter = require('./routes/userRoute');
const productRouter = require('./routes/productRoute');
const adminRouter = require('./routes/adminRoute');
const cartRoute = require('./routes/cartRoute'); // Consistent naming

// Database connection (assuming in `config/database.js`)
require('./config/database');

// Middleware setup
app.use(cookieParser());
app.use(bodyParser.json()); // Use only for JSON parsing
app.use(bodyParser.urlencoded({ extended: true })); // Only if required for form data

const allowCors = fn => async (req, res, next) => {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', 'https://ecommerce-fullstack-frontend-theta.vercel.app');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  return fn(req, res, next);
};

// Apply custom CORS to all routes
app.use(allowCors((_req, _res, next) => next()));


app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());



// app.use('/api/order', orderRouter);
// app.use('/api/product', productRouter);
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

