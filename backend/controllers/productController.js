const { Product } = require("../models/productModel");
const userService = require('../services/userService')
const productService= require('../services/productService')


async function displayProduct(req,res){
    const { category } = req.query;

    try {
        let products;
        if (category) {
            // Return all products that match the specified category
            products = await Product.find({ category });
        } else {
            // Return all products if no category is specified
            products = await Product.find();
        }
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

async function searchProduct(req,res){
 
  console.log('hello from searchproduct second')

    try {
        const { name, minPrice, maxPrice, description } = req.query;
        const query = {};

        if (name) {
            query.$text = { $search: name }; // Text search on indexed fields
        }
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }
        if (description) {
            query.description = { $regex: description, $options: 'i' }; // Case-insensitive regex search
        }

        const products = await Product.find(query).select('name price description'); // Use projection to limit returned fields
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


async function addProduct(req, res) {
  try {
      const productData = req.body;
      const userId = req.body.userId;

      if (!productData.image) {
          return res.status(400).json({ message: 'Image is required' });
      }

      if (!userId) {
          return res.status(400).json({ message: 'User ID is required' });
      }

      const product = await userService.addProduct(productData, userId);
      res.status(201).json({ product });
  } catch (error) {
      console.error('Error adding product:', error);
      res.status(500).json({ message: error.message });
  }
}

async function deleteProduct(req,res){
    try{
        const ProductId = User.findById(req.params.id);
        if(ProductId){
            await ProductId.remove();
            res.status(200).json({message:'deletion succesfull'});
        }else{
            res.status(404).json({message:"deletion unsucessfull"})
        }
        
    }catch(error){
        res.status(500).json({error:error.message})
    }
}




async function removeCart(req, res) {
    const { id } = req.params; // Assuming you're passing the ID as a route parameter
    const result = await userService.removeCartService(id);
    res.status(result.status).json(result.data);
}


  

  async function searchProductSecond(req,res){
    try {
        const query = req.query.q;
        const category = req.query.category;
        const brand = req.query.brand;
        const minPrice = req.query.minPrice;
        const maxPrice = req.query.maxPrice;
    
        const searchQuery = {};
    
        if (query) {
          searchQuery.$or = [
            { name: { $regex: query, $options: 'i' } },
            { description: { $regex: query, $options: 'i' } },
            { category: { $regex: query, $options: 'i' } },
            { brand: { $regex: query, $options: 'i' } },
          ];
        }
    
        if (category) {
          searchQuery.category = category;
        }
    
        if (brand) {
          searchQuery.brand = brand;
        }
    
        if (minPrice && maxPrice) {
          searchQuery.price = { $gte: minPrice, $lte: maxPrice };
        }
    
        const products = await Product.find(searchQuery).exec();
        res.json(products);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
      }
}


async function getCateProduct(req, res) {
    const {category} = req.query;
  try {
    const products = await Product.find({ category: category });
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error retrieving products' });
  }
}

async function getProductById(req, res) {
    const {id} = req.params;
 
  try {
    const products = await Product.findById(id)
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error retrieving products' });
  }
}








module.exports = {
    displayProduct,
    searchProduct,
    addProduct,
    deleteProduct,
    removeCart,
    searchProductSecond,
    getCateProduct,
    getProductById
}



