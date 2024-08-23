

const mongoose = require('mongoose');
require('dotenv').config();
const pass = process.env.MONGODB_PASSWORD

console.log('pass',pass)

mongoose.connect(`mongodb+srv://memilanrai19:${pass}@cluster-ecommerce.uerhg.mongodb.net/ecommerce?retryWrites=true&w=majority`);
mongoose.connection.on('connected', () => {
    console.log('connected to mongodb');
})

mongoose.connection.on('error', (error) => {
  console.error('error connecting to mongodb', error.message);
  console.error('error details:', error);
})


