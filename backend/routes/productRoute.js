const express = require('express');
const { displayProduct, searchProduct, addProduct, getProductById, deleteProduct, removeCart, searchProductSecond, getCateProduct } = require('../controllers/productController');
const router = express.Router();
const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');
require('dotenv').config();

// Configure Cloudinary using environment variables
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Use memory storage for multer
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Modify the addProduct route to use Cloudinary
router.post('/addProduct', upload.single('image'), async (req, res, next) => {
  try {
      if (!req.file) {
          return res.status(400).json({ message: 'No file uploaded' });
      }

      // Convert buffer to base64
      const fileStr = req.file.buffer.toString('base64');
      const fileUri = `data:${req.file.mimetype};base64,${fileStr}`;

      // Upload to Cloudinary
      const uploadResult = await cloudinary.uploader.upload(fileUri, {
          resource_type: 'auto',
          public_id: `product_${Date.now()}`, // Generate a unique public_id
      });

      // Add the Cloudinary URL to the request body
      req.body.image = uploadResult.secure_url;

      // Optimize delivery
      const optimizeUrl = cloudinary.url(uploadResult.public_id, {
          fetch_format: 'auto',
          quality: 'auto'
      });

      req.body.optimizedImageUrl = optimizeUrl;

      // Call the addProduct controller
      addProduct(req, res, next);
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error uploading image' });
  }
});

// Other routes
router.get('/search', searchProductSecond);
router.get('/idProduct/:id', getProductById);

module.exports = router;
