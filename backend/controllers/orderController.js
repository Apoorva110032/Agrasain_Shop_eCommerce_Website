import asyncHandler from 'express-async-handler'
import Order from '../models/orderModel.js'

// @desc Create New Order
// @route POST /api/orders
// @access Private
const addOrderItems = asyncHandler(async(req, res) => {
    const { orderItems, shippingAddress, paymentMethod, itemsPrice, taxPrice, shippingPrice, totalPrice } = req.body

    if(orderItems && orderItems.length === 0) {
        res.status(400) //Bad Request
        throw new Error('No Order Items')
        return
    } else {
        const order = new Order({
            user: req.user._id, //Protected Route so, we'll be able to get the token & thus get the user ID from the token
            orderItems, shippingAddress, paymentMethod, itemsPrice, taxPrice, shippingPrice, totalPrice
        })

        //Save to the Database
        const createdOrder = await order.save()

        res.status(201).json(createdOrder)              //Status 201 because something is created
    }
})

// @desc Get an Order by ID
// @route GET /api/orders/:id
// @access Private
const getOrderByID = asyncHandler(async(req, res) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email') //populate() lets us reference documents in other collections
    //Population is the process of automatically replacing the specified paths in the document with document(s) from other collection(s).
    //If we only want a few specific fields returned for the populated documents, 
    //pass the usual field name syntax as the second argument to the populate method

    if(order) {
        res.json(order)
        //The res. json function on the other handsets the content-type header to application/JSON 
        //so that the client treats the response string as a valid JSON object. It also then returns the response to the client.
    } else {
        res.status(404)
        throw new Error('Order Not Found!')
    }
})

// @desc Update Order to Paid
// @route GET /api/orders/:id/pay
// @access Private
const updateOrderToPaid = asyncHandler(async(req, res) => {
    const order = await Order.findById(req.params.id)

    if(order) {
        order.isPaid = true
        order.paidAt = Date.now()
        order.paymentResult = {  //This is going to come from PayPal
            id: req.body.id,
            status: req.body.status,
            update_time: req.body.update_time,      //All this stuff is going to come from PayPal response
            email_address: req.body.payer.email_address   //Payer Object
        }
        
        //Save to the Database
        const updatedOrder = await order.save()

        res.json(updatedOrder)  //Respond/send the updated order
    } else {
        res.status(404)
        throw new Error('Order Not Found!')
    }
})

// @desc Update Order to Delivered
// @route GET /api/orders/:id/deliver
// @access Private/Admin
const updateOrderToDelivered = asyncHandler(async(req, res) => {
    const order = await Order.findById(req.params.id)

    if(order) {
        order.isDelivered = true
        order.deliveredAt = Date.now()
        
        //Save to the Database
        const updatedOrder = await order.save()

        res.json(updatedOrder)  //Respond/send the updated order
    } else {
        res.status(404)
        throw new Error('Order Not Found!')
    }
})

// @desc Get logged in user's orders
// @route GET /api/orders/myorders
// @access Private
const getMyOrders = asyncHandler(async(req, res) => {
    const orders = await Order.find({user: req.user._id})

    res.json(orders)
})

// @desc Get all Orders
// @route GET /api/orders
// @access Private/Admin
const getOrders = asyncHandler(async(req, res) => {
    const orders = await Order.find({}).populate('user', 'id name')

    res.json(orders)
})

export { addOrderItems, getOrderByID, updateOrderToPaid, getMyOrders, getOrders, updateOrderToDelivered }