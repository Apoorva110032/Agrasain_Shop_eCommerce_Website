import asyncHandler from 'express-async-handler'
import Product from '../models/productModel.js'

// @desc Fetch all products
// @route GET /api/products
// @access Public
const getProducts = asyncHandler(async(req, res) => {
    const pageSize = 2
    const page = Number(req.query.pageNumber) || 1

    const keyword = req.query.keyword ? {
        name: {           //Want to match keyword with Name of Product
            $regex: req.query.keyword,  //To match partial input with regular expression
            $options: 'i'   //i is for ignore case
        }
    } : {} //Empty brackets if keyword doesn't exist or if it is an empty string 
    //All products show up if we don't put anything in search box - i.e. empty string
    //No products show up if keyword doesn't exist

    const count = await Product.countDocuments({ ...keyword })  //Spreading the keyword which will be searched above 
    const products = await Product.find({ ...keyword }).limit(pageSize).skip(pageSize * (page - 1)) 
    //limit() - limits no. of products searched to pageSize (to come on a single page)
    //skip() - those searches will be skipped which come on earlier pages if we are on some later page
    
    res.json({ products, page, pages: Math.ceil(count/pageSize) })                       //Since it is a JSON object 
})

// @desc Fetch single product
// @route GET /api/products/:id
// @access Public
const getProductById = asyncHandler(async(req, res) => {
    const product = await Product.findById(req.params.id)
    if(product) {
        res.json(product)                       //Since it is a JSON object 
    }
    else {
        res.status(404)            //If product with that ID is not found 
        throw new Error('Product Not Found')
    }
})

// @desc Delete a Product
// @route DELETE /api/products/:id
// @access Private/Admin
const deleteProduct = asyncHandler(async(req, res) => {
    const product = await Product.findById(req.params.id)
    if(product) {
        await product.remove()      //If we want only the admin who created the product to delete it, then: req.params.id = product.user._id
        res.json({ message: 'Product Removed!' })
    }
    else {
        res.status(404)            //If product with that ID is not found 
        throw new Error('Product Not Found')
    }
})

// @desc Create a Product
// @route POST /api/products
// @access Private/Admin
const createProduct = asyncHandler(async(req, res) => {
    const product = new Product({
        name: 'Sample Name',
        price: 0,
        user: req.user._id,
        image: '/images/sample.jpg?w=100&h=100',
        brand: 'Sample Brand',
        category: 'Sample Category',
        countInStock: 0,
        numReviews: 0,
        description: 'Sample Description'
    })

    const createdProduct = await product.save()
    res.status(201).json(createdProduct)
})

// @desc Update a Product
// @route PUT /api/products/:id
// @access Private/Admin
const updateProduct = asyncHandler(async(req, res) => {
    const { name, price, image, brand, category, countInStock, description } = req.body

    const product = await Product.findById(req.params.id)

    if(product) {
        product.name = name
        product.price = price
        product.image = image
        product.brand = brand
        product.category = category
        product.countInStock = countInStock
        product.description = description
        
        const updatedProduct = await product.save()  //Save product to the Database
        res.json(updatedProduct)
    } else {
        res.status(404)
        throw new Error('Product Not Found!')
    }
})

// @desc Create a new Review
// @route POST /api/products/:id/reviews
// @access Private
const createProductReview = asyncHandler(async(req, res) => {
    const { rating, comment } = req.body

    const product = await Product.findById(req.params.id)

    if(product) {
        const alreadyReviewed = product.reviews.find((rev) => rev.user.toString() === req.user._id.toString()) //req.user._id - logged in user
        //review.user.toString() === req.user._id - this will return that review where the 2 values are equal
        //If not, then the above constant 'alreadyReviewed' doesn't get any value
        if(alreadyReviewed) {
            res.status(400)  //Bad Request
            throw new Error('Product Already Reviewed!')
        }

        const review = {
            user: req.user._id,
            name: req.user.name,
            rating: Number(rating),
            comment
        }

        product.reviews.push(review)
        product.numReviews = product.reviews.length
        product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0)/product.reviews.length

        await product.save()
        res.status(201).json({ message: 'Review Added!'})  //New Resource Created
    } else {
        res.status(404)
        throw new Error('Product Not Found!')
    }
})

// @desc Get Top Rated Products
// @route GET /api/products/top
// @access Public
const getTopProducts = asyncHandler(async(req, res) => {
    const products = await Product.find({}).sort({rating: -1}).limit(3) //To get top 3 

    res.json(products)
})

export { getProducts, getProductById, deleteProduct, createProduct, updateProduct, createProductReview, getTopProducts }