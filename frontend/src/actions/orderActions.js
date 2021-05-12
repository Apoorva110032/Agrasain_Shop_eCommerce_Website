import { 
    ORDER_CREATE_REQUEST, 
    ORDER_CREATE_SUCCESS, 
    ORDER_CREATE_FAIL,
    ORDER_DETAILS_REQUEST,
    ORDER_DETAILS_SUCCESS,
    ORDER_DETAILS_FAIL,
    ORDER_PAY_REQUEST,
    ORDER_PAY_SUCCESS,
    ORDER_PAY_FAIL,
    ORDER_LIST_MY_REQUEST,
    ORDER_LIST_MY_SUCCESS,
    ORDER_LIST_MY_FAIL,
    ORDER_LIST_REQUEST,
    ORDER_LIST_SUCCESS,
    ORDER_LIST_FAIL,
    ORDER_DELIVER_REQUEST,
    ORDER_DELIVER_SUCCESS,
    ORDER_DELIVER_FAIL
} from '../constants/orderConstants'
import axios from 'axios'

export const createOrder = (order) => async(dispatch, getState) => {  //getState: to get user info from getState which has the token
    try {
        dispatch({
            type: ORDER_CREATE_REQUEST
        })

        const { userLogin: { userInfo } } = getState() //Destructuring 2 levels
        const config = {    //config object because when we are actually sending data, we want to send in headers - here we will also pass the token 
            // for the protected routes, we will set the authorization for the token    
            headers: {
                'Content-Type': 'application/json',         //This is passed in because we are sending some data
                Authorization: `Bearer ${userInfo.token}`   //Pass token from here as authorization
            }
        }

        const { data } = await axios.post('/api/orders', order, config)  //Passing order object as second argument - sets data we wanna update with

        dispatch({
            type: ORDER_CREATE_SUCCESS,
            payload: data  //The newly created order
        })

    } catch (error) {
        dispatch({ 
            type: ORDER_CREATE_FAIL,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message
        })
    }
}

export const getOrderDetails = (id) => async(dispatch, getState) => {  //getState: to get user info from getState which has the token
    try {
        dispatch({
            type: ORDER_DETAILS_REQUEST
        })

        const { userLogin: { userInfo } } = getState() //Destructuring 2 levels
        const config = {    //config object because when we are actually sending data, we want to send in headers - here we will also pass the token 
            // for the protected routes, we will set the authorization for the token    
            headers: {
                //Pass token from here as authorization into our headers 
                Authorization: `Bearer ${userInfo.token}` //Content-type is not reqd since it is a GET request, so nothing is being sent
            }
        }

        const { data } = await axios.get(`/api/orders/${id}`, config)  //Data is retrieved from Database through backend 
        //From the route (in backend): api/orders/:id, the 'getOrderById' Controller is invoked which is protected by a middleware
        //This controller takes data for the order using 'Order.findById(req.params.id)' from Database (sent to state) belonging to 'Order' Model
        //Then sends it to client i.e. the data is received here

        dispatch({
            type: ORDER_DETAILS_SUCCESS,
            payload: data  //The newly created order
        })

    } catch (error) {
        dispatch({ 
            type: ORDER_DETAILS_FAIL,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message
        })
    }
}

export const payOrder = (orderId, paymentResult) => async(dispatch, getState) => {  //getState: to get user info from getState which has the token
    try {
        dispatch({
            type: ORDER_PAY_REQUEST
        })

        const { userLogin: { userInfo } } = getState() //Destructuring 2 levels - Getting user info
        const config = {    //config object because when we are actually sending data, we want to send in headers - here we will also pass the token 
            // for the protected routes, we will set the authorization for the token    
            headers: {
                'Content-Type': 'application/json',  //This is passed in because we are sending some data
                //Pass token from here as authorization into our headers
                Authorization: `Bearer ${userInfo.token}` 
            }
        }

        const { data } = await axios.put(`/api/orders/${orderId}/pay`, paymentResult, config)  //Passing in Payment Result received from PayPal
        //Data is retrieved from Database through backend 
        //From the route (in backend): api/orders/:id/pay, the 'updateOrderToPaid' Controller is invoked which is protected by a middleware
        //This controller takes data for the order using 'Order.findById(req.params.id)' from Database (sent to state) belonging to 'Order' Model
        //Then sends it to client i.e. the data is received here

        dispatch({
            type: ORDER_PAY_SUCCESS,
            payload: data  //The updated order received from controller function 'updateOrderToPaid'
        })

    } catch (error) {
        dispatch({ 
            type: ORDER_PAY_FAIL,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message
        })
    }
}

export const deliverOrder = (order) => async(dispatch, getState) => {  //getState: to get user info from getState which has the token
    try {
        dispatch({
            type: ORDER_DELIVER_REQUEST
        })

        const { userLogin: { userInfo } } = getState() //Destructuring 2 levels - Getting user info
        const config = {    //config object because when we are actually sending data, we want to send in headers - here we will also pass the token 
            // for the protected routes, we will set the authorization for the token    
            headers: {
                'Content-Type': 'application/json',
                //Pass token from here as authorization into our headers
                Authorization: `Bearer ${userInfo.token}` 
            }
        }

        const { data } = await axios.put(`/api/orders/${order._id}/deliver`, {}, config)  //Pass empty object as 2nd argument as sending nothing
        //Data is retrieved from Database through backend 
        //From the route (in backend): api/orders/:id/deliver, the 'updateOrderToDelivered' Controller is invoked which is protected by a middleware
        //This controller takes data for the order using 'Order.findById(req.params.id)' from Database (sent to state) belonging to 'Order' Model
        //Then sends it to client i.e. the data is received here

        dispatch({
            type: ORDER_DELIVER_SUCCESS,
            payload: data  //The updated order received from controller function 'updateOrderToDelivered'
        })

    } catch (error) {
        dispatch({ 
            type: ORDER_DELIVER_FAIL,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message
        })
    }
}

export const listMyOrders = () => async(dispatch, getState) => {  //getState: to get user info from getState which has the token
    try {
        dispatch({
            type: ORDER_LIST_MY_REQUEST
        })

        const { userLogin: { userInfo } } = getState() //Destructuring 2 levels - Getting user info
        const config = {    //config object because when we are actually sending data, we want to send in headers - here we will also pass the token 
            // for the protected routes, we will set the authorization for the token    
            headers: {
                //Pass token from here as authorization into our headers
                Authorization: `Bearer ${userInfo.token}` 
            }
        }

        const { data } = await axios.get('/api/orders/myorders', config)  
        //Data is retrieved from Database through backend 
        //From the route (in backend): api/orders/myorders, the 'getMyOrders' Controller is invoked which is protected by a middleware
        //This controller takes data for the order using 'Order.find()' from Database (sent to state) belonging to 'Order' Model
        //Then sends it to client i.e. the data is received here

        dispatch({
            type: ORDER_LIST_MY_SUCCESS,
            payload: data  //The user's orders
        })

    } catch (error) {
        dispatch({ 
            type: ORDER_LIST_MY_FAIL,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message
        })
    }
}

export const listOrders = () => async(dispatch, getState) => {  //getState: to get user info from getState which has the token
    try {
        dispatch({
            type: ORDER_LIST_REQUEST
        })

        const { userLogin: { userInfo } } = getState() //Destructuring 2 levels - Getting user info
        const config = {    //config object because when we are actually sending data, we want to send in headers - here we will also pass the token 
            // for the protected routes, we will set the authorization for the token    
            headers: {
                //Pass token from here as authorization into our headers
                Authorization: `Bearer ${userInfo.token}` 
            }
        }

        const { data } = await axios.get('/api/orders', config)  
        //Data is retrieved from Database through backend 
        //From the route (in backend): api/orders/myorders, the 'getMyOrders' Controller is invoked which is protected by a middleware
        //This controller takes data for the order using 'Order.find()' from Database (sent to state) belonging to 'Order' Model
        //Then sends it to client i.e. the data is received here

        dispatch({
            type: ORDER_LIST_SUCCESS,
            payload: data  //All the orders
        })

    } catch (error) {
        dispatch({ 
            type: ORDER_LIST_FAIL,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message
        })
    }
}