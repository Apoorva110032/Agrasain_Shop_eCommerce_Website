import { createStore, combineReducers, applyMiddleware } from 'redux'  
//Redux includes a function called applyMiddleware, which sets up the middleware pipeline for use with the store. 
//It takes middleware as parameters, and returns a "store enhancer" that is passed to createStore.
import thunk from 'redux-thunk'
//Asynchronous code like AJAX calls and timeouts are known as side effects.
//The most commonly used middleware for side effects in Redux are  redux-thunk, which lets you pass functions to dispatch.
//Thunks are useful for complex synchronous logic, like multiple dispatches or conditional dispatching based on store state, & simple async logic.
import { composeWithDevTools } from 'redux-devtools-extension'
import { 
    productListReducer, 
    productDetailsReducer, 
    productDeleteReducer, 
    productCreateReducer, 
    productUpdateReducer,
    productReviewCreateReducer,
    productTopRatedReducer 
} from './reducers/productReducers'
import { cartReducer } from './reducers/cartReducers'
import { 
    orderCreateReducer, 
    orderDetailsReducer, 
    orderPayReducer, 
    orderDeliverReducer,
    orderListMyReducer, 
    orderListReducer
} from './reducers/orderReducers'
import { 
    userLoginReducer, 
    userRegisterReducer, 
    userDetailsReducer, 
    userUpdateProfileReducer, 
    userListReducer, 
    userDeleteReducer,
    userUpdateReducer
} from './reducers/userReducers'


const reducer = combineReducers({  //for the update logic 
    productList: productListReducer,
    productDetails: productDetailsReducer,
    productDelete: productDeleteReducer,
    productCreate: productCreateReducer,
    productUpdate: productUpdateReducer,
    productReviewCreate: productReviewCreateReducer,
    productTopRated: productTopRatedReducer,
    cart: cartReducer,
    userLogin: userLoginReducer,
    userRegister: userRegisterReducer,
    userDetails: userDetailsReducer,
    userUpdateProfile: userUpdateProfileReducer,
    userList: userListReducer,
    userDelete: userDeleteReducer,
    userUpdate: userUpdateReducer,
    orderCreate: orderCreateReducer,
    orderDetails: orderDetailsReducer,
    orderPay: orderPayReducer,
    orderDeliver: orderDeliverReducer,
    orderListMy: orderListMyReducer,
    orderList: orderListReducer
})  
//Since reducers are just functions, they can call other functions to do some of the work. 
//It's normal to have a root reducer function that calls other reducers, splitting up the job of updating the Redux state object.
//Because this is common, Redux provides a utility called combineReducers to make it easy to combine them.

const cartItemsFromStorage = localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')) : []
const userInfoFromStorage = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null
const shippingAddressFromStorage = localStorage.getItem('shippingAddress') ? JSON.parse(localStorage.getItem('shippingAddress')) : {}
//Check for shipping address in storage & if that is there, then get it & use it, & if not, then it's just gonna be an empty object
// const paymentMethodFromStorage = localStorage.getItem('paymentMethod') ? JSON.parse(localStorage.getItem('paymentMethod')) : {}

const initialState = {
    cart: { cartItems: cartItemsFromStorage, shippingAddress: shippingAddressFromStorage },  
    //Add those to our cart states
    userLogin: { userInfo: userInfoFromStorage }
}
const middleware = [thunk]  //Middleware provides the capability to run code after an action is dispatched, but before it reaches the reducer.
//Each middleware in the chain can pass actions onward.
//A middleware can inspect actions and state, modify actions, dispatch other actions, stop actions from reaching the reducers, and much more.
const store = createStore(reducer, initialState, composeWithDevTools(applyMiddleware(...middleware)))
// The center of every Redux application is the store. A "store" is a container that holds your application's global state.
//We can create a store instance by calling the Redux library createStore API or createStore function we can say.
//We pass the reducer function to createStore, which uses the reducer function to generate the initial state, and to calculate any future updates.
export default store