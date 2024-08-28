require("dotenv").config();
const express = require('express');
const app = express();
const port = process.env.PORT
const cors = require('cors');
const userRouter = require('./routes/userRoute');
const productRouter = require('./routes/productRoute');
const adminRouter = require('./routes/adminRoute');
const orderRouter = require('./routes/orderRoute');
const cartRoute  = require('./routes/cartRoute')
require('./config/database');
const bodyParser = require('body-parser');
const path = require('path');
const cookieParser = require('cookie-parser');


const corsOptions = {
  origin: 'https://ecommerce-fullstack-frontend-kwy8657oh-milanrai09s-projects.vercel.app',
  methods: 'GET, HEAD, PUT, PATCH, POST, DELETE',
  credentials: true,
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));




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

