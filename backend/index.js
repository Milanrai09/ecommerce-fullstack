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
const dbConnects = require('./config/database');
const bodyParser = require('body-parser');
const path = require('path');
const cookieParser = require('cookie-parser');



dbConnects.dbConnect()
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

app.get('/', (req, res) => {
  res.send('Hello ecommerce testing and hope this works');
});

app.get('/testing', (req, res) => {
  res.send('hello world');
});

app.listen(port, () => {
  console.log('Hello !! The server is live ...', port);
});
