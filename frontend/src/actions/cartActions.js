import axios from 'axios'
import { CART_ADD_ITEM, CART_REMOVE_ITEM, CART_SAVE_SHIPPING_ADDRESS, CART_SAVE_PAYMENT_METHOD } from '../constants/cartConstants'

export const addToCart = (id, qty) => async (dispatch, getState) => {
    const { data } = await axios.get(`/api/products/${id}`)

    dispatch({
        type: CART_ADD_ITEM,
        payload: {
            product: data._id,
            name: data.name,
            image: data.image,
            price: data.price,
            countInStock: data.countInStock,
            qty
        }
    })

    localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems))
}        

export const removeFromCart = (id) => async (dispatch, getState) => {  //getState -> to get all items present in cart to reset local storage

    dispatch({
        type: CART_REMOVE_ITEM,
        payload: id
    })

    localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems))
} 

export const saveShippingAddress = (data) => async (dispatch) => {  //getState -> to get all items present in cart to reset local storage

    dispatch({
        type: CART_SAVE_SHIPPING_ADDRESS,  //This will be called on dispatching function/action saveShippingAddress
        payload: data
    })

    localStorage.setItem('shippingAddress', JSON.stringify(data))
} 

export const savePaymentMethod = (data) => async (dispatch) => {  //getState -> to get all items present in cart to reset local storage

    dispatch({
        type: CART_SAVE_PAYMENT_METHOD,  //This will be called on dispatching function/action savePaymentMethod
        payload: data
    })

    // localStorage.setItem('paymentMethod', JSON.stringify(data))
} 