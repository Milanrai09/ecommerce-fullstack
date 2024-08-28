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

