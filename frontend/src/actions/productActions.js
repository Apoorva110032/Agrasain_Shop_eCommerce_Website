import axios from 'axios'
import { 
    PRODUCT_LIST_REQUEST, 
    PRODUCT_LIST_SUCCESS, 
    PRODUCT_LIST_FAIL, 
    PRODUCT_DETAILS_REQUEST, 
    PRODUCT_DETAILS_SUCCESS, 
    PRODUCT_DETAILS_FAIL, 
    PRODUCT_DELETE_REQUEST,
    PRODUCT_DELETE_SUCCESS,
    PRODUCT_DELETE_FAIL,
    PRODUCT_CREATE_REQUEST,
    PRODUCT_CREATE_SUCCESS,
    PRODUCT_CREATE_FAIL,
    PRODUCT_UPDATE_REQUEST,
    PRODUCT_UPDATE_SUCCESS,
    PRODUCT_UPDATE_FAIL,
    PRODUCT_CREATE_REVIEW_REQUEST,
    PRODUCT_CREATE_REVIEW_SUCCESS,
    PRODUCT_CREATE_REVIEW_FAIL,
    PRODUCT_TOP_REQUEST,
    PRODUCT_TOP_SUCCESS,
    PRODUCT_TOP_FAIL
} from '../constants/productConstants'


export const listProducts = (keyword = '', pageNumber = '') => async(dispatch) => {  //Default keyword - empty string
    //Action Creators - Redux Thunk for Asynchronous Functions - to add a function within a function 
    try {
        dispatch({ type: PRODUCT_LIST_REQUEST })

        const { data } = await axios.get(`/api/products?keyword=${keyword}&pageNumber=${pageNumber}`)

        dispatch({
            type: PRODUCT_LIST_SUCCESS,
            payload: data
        })
    } catch (error) {
        dispatch({ 
            type: PRODUCT_LIST_FAIL,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message
        })
    }
}

export const listProductDetails = (id) => async(dispatch) => {  //Action Creators - Redux Thunk for Asynchronous Functions
    try {
        dispatch({ type: PRODUCT_DETAILS_REQUEST })

        const { data } = await axios.get(`/api/products/${id}`)

        dispatch({
            type: PRODUCT_DETAILS_SUCCESS,
            payload: data
        })
    } catch (error) {
        dispatch({ 
            type: PRODUCT_DETAILS_FAIL,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message
        })
    }
}

export const deleteProduct = (id) => async(dispatch, getState) => {  //getState: to get user info from getState which has the token
    try {
        dispatch({ type: PRODUCT_DELETE_REQUEST })

        const { userLogin: { userInfo } } = getState() //Destructuring 2 levels - Getting user info
        const config = {    //config object because when we are actually sending data, we want to send in headers - here we will also pass the token 
            // for the protected routes, we will set the authorization for the token    
            headers: {
                //Pass token from here as authorization into our headers
                Authorization: `Bearer ${userInfo.token}` 
            }
        }

        await axios.delete(`/api/products/${id}`, config)  
        //Data is deleted from Database through backend 

        dispatch({ type: PRODUCT_DELETE_SUCCESS })

    } catch (error) {
        dispatch({ 
            type: PRODUCT_DELETE_FAIL,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message
        })
    }
}

export const createProduct = () => async(dispatch, getState) => {  //getState: to get user info from getState which has the token
    try {
        dispatch({ type: PRODUCT_CREATE_REQUEST })

        const { userLogin: { userInfo } } = getState() //Destructuring 2 levels - Getting user info
        const config = {    //config object because when we are actually sending data, we want to send in headers - here we will also pass the token 
            // for the protected routes, we will set the authorization for the token    
            headers: {
                //Pass token from here as authorization into our headers
                Authorization: `Bearer ${userInfo.token}` 
            }
        }

        const { data } = await axios.post('/api/products', {}, config)  
        //Second argument: Empty object, since we're making a POST request, but we're not actually sending any data here
        //Data is obtained from Database through backend 

        dispatch({ 
            type: PRODUCT_CREATE_SUCCESS,
            payload: data 
        })

    } catch (error) {
        dispatch({ 
            type: PRODUCT_CREATE_FAIL,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message
        })
    }
}

export const updateProduct = (product) => async(dispatch, getState) => {  //getState: to get user info from getState which has the token
    try {
        dispatch({ type: PRODUCT_UPDATE_REQUEST })

        const { userLogin: { userInfo } } = getState() //Destructuring 2 levels - Getting user info
        const config = {    //config object because when we are actually sending data, we want to send in headers - here we will also pass the token 
            // for the protected routes, we will set the authorization for the token    
            headers: {
                'Content-Type': 'application/json',
                //Pass token from here as authorization into our headers
                Authorization: `Bearer ${userInfo.token}` 
            }
        }

        const { data } = await axios.put(`/api/products/${product._id}`, product, config)  
        //Data is obtained from Database through backend 

        dispatch({ 
            type: PRODUCT_UPDATE_SUCCESS,
            payload: data 
        })

    } catch (error) {
        dispatch({ 
            type: PRODUCT_UPDATE_FAIL,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message
        })
    }
}

export const createProductReview = (productId, review) => async(dispatch, getState) => {  //getState: to get user info from getState which has the token
    try {
        dispatch({ type: PRODUCT_CREATE_REVIEW_REQUEST })

        const { userLogin: { userInfo } } = getState() //Destructuring 2 levels - Getting user info
        const config = {    //config object because when we are actually sending data, we want to send in headers - here we will also pass the token 
            // for the protected routes, we will set the authorization for the token    
            headers: {
                'Content-Type': 'application/json',
                //Pass token from here as authorization into our headers
                Authorization: `Bearer ${userInfo.token}` 
            }
        }

        await axios.post(`/api/products/${productId}/reviews`, review, config)  
        //We are not returning anything from here, so not putting it in any variable like 'data'

        dispatch({ type: PRODUCT_CREATE_REVIEW_SUCCESS })  //Sets success to true

    } catch (error) {
        dispatch({ 
            type: PRODUCT_CREATE_REVIEW_FAIL,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message
        })
    }
}

export const listTopProducts = () => async(dispatch) => {  
    //Action Creators - Redux Thunk for Asynchronous Functions - to add a function within a function 
    try {
        dispatch({ type: PRODUCT_TOP_REQUEST })

        const { data } = await axios.get('/api/products/top')

        dispatch({
            type: PRODUCT_TOP_SUCCESS,
            payload: data
        })
    } catch (error) {
        dispatch({ 
            type: PRODUCT_TOP_FAIL,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message
        })
    }
}