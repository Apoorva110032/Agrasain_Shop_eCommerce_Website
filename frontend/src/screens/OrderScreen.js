import React, { useState, useEffect } from 'react'
import { Row, Col, ListGroup, Image, Card, Button } from 'react-bootstrap'
import { PayPalButton } from 'react-paypal-button-v2'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { getOrderDetails, payOrder, deliverOrder } from '../actions/orderActions'
import { ORDER_PAY_RESET, ORDER_DELIVER_RESET } from '../constants/orderConstants'

const OrderScreen = ({ match, history }) => {

    const orderId = match.params.id
    const [sdkReady, setSdkReady] = useState(false)
    const dispatch = useDispatch()

    const userLogin = useSelector(state => state.userLogin)  //Received from states (reducers) - the logged in user
    const { userInfo } = userLogin

    const orderDetails = useSelector(state => state.orderDetails)  //Received from states (reducers)
    const { order, loading, error } = orderDetails

    const orderPay = useSelector(state => state.orderPay)  //Get from the state the orderPay from reducers & check if success is true
    const { loading: loadingPay, success: successPay } = orderPay
    //Since we already have 'loading' & 'success' above, so renamed them to 'loadingPay' & 'successPay' respectively

    const orderDeliver = useSelector(state => state.orderDeliver) //Get from the state the orderDeliver from reducers & check if success is true
    const { loading: loadingDeliver, success: successDeliver } = orderDeliver

    const addDecimals = (num) => {
        return (Math.round(num * 100) / 100).toFixed(2)
    }

    if (!loading) {
        //Calculate Prices - since itemsPrice is not in our Object Model 
        order.itemsPrice = addDecimals(order.orderItems.reduce((acc, item) => acc + item.price * item.qty, 0))
    }

    useEffect(() => {

        if(!userInfo) {
            history.push('/login')  //If the URL is to this screen but none is logged in 
        }

        const addPayPalScript = async () => {  //Building script when the page/component loads -> Dynamically adding PayPal Script
            const { data: clientId } = await axios.get('/api/config/paypal')  //Fetch Client ID from backend
            const script = document.createElement('script') //Creating a new script
            script.type = 'text/javascript'                 //Having a type to script
            script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`
            script.async = true                             //We want this to be asynchronous
            script.onload = () => {
                setSdkReady(true)  //Script Loaded
            }
            document.body.appendChild(script) //Add script to body
        }

        if (!order || successPay || successDeliver) {   //Dispatch 'getOrderDetails' again -> Load the order again but it should be paid
            dispatch({ type: ORDER_PAY_RESET })  
            dispatch({ type: ORDER_DELIVER_RESET })  
            dispatch(getOrderDetails(orderId))  //Reset the screen basically
        } else if (!order.isPaid) {  //If order isn't paid, it will add the PayPal Script as present above
            if (!window.paypal) {
                addPayPalScript()
            } else {
                setSdkReady(true)
            }
        }
    }, [dispatch, history, userInfo, orderId, successPay, successDeliver, order])
    //Because successDeliver is a dependency, so whenever successDeliver is true, useEffect will get fired off

    const successPaymentHandler = (paymentResult) => {   
        console.log(paymentResult)
        dispatch(payOrder(orderId, paymentResult))    //Call payOrder Action -> It will update the Database to Paid & thus successPay - true
        //Then in useEffect, it should dispatch the 'getOrderDetails' once again to get the order, & it should be paid
    }

    const deliverHandler = () => {   
        dispatch(deliverOrder(order))    //Call deliverOrder Action -> It will update the Database to Delivered & thus successDeliver - true
        //Then in useEffect, it should dispatch the 'getOrderDetails' once again to get the order, & it should be delivered
    }

    return (loading ? <Loader /> : error ? <Message variant='danger'>{error}</Message> :
        <>
            <h1>Order {order._id}</h1>
            <Row>
                <Col md={8}>
                    <ListGroup variant='flush'>
                        <ListGroup.Item>
                            <h2>Shipping</h2>
                            <p><strong>Name: </strong>{order.user.name}</p>
                            <p><strong>Email: </strong><a href={`mailto:${order.user.email}`}>{order.user.email}</a></p>
                            <p>
                                <strong>Address: </strong>
                                {order.shippingAddress.address},
                                {order.shippingAddress.city},
                                {order.shippingAddress.postalCode},
                                {order.shippingAddress.country}
                            </p>
                            {order.isDelivered ? (
                                <Message variant='success'>Delivered on {order.deliveredAt}</Message>
                            ) : (
                                <Message variant='danger'>Not Delivered</Message>
                            )}
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <h2>Payment</h2>
                            <p>
                                <strong>Method: </strong>
                                {order.paymentMethod}
                            </p>
                            {order.isPaid ? (
                                <Message variant='success'>Paid on {order.paidAt}</Message>
                            ) : (
                                <Message variant='danger'>Not Paid</Message>
                            )}
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <h2>Order Items</h2>
                            {order.orderItems.length === 0 ? <Message>Order is Empty!</Message> : (
                                <ListGroup variant='flush'>
                                    {order.orderItems.map((item, index) => (
                                        <ListGroup.Item key={index}>
                                            <Row>
                                                <Col md={1}>
                                                    <Image src={item.image} alt={item.name} fluid rounded />
                                                </Col>
                                                <Col>
                                                    <Link to={`/product/${item.product}`}>
                                                        {item.name}
                                                    </Link>
                                                </Col>
                                                <Col md={4}>
                                                    {item.qty} x {item.price} = {addDecimals(item.qty * item.price)}
                                                </Col>
                                            </Row>
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            )}
                        </ListGroup.Item>
                    </ListGroup>
                </Col>
                <Col md={4}>
                    <Card>
                        <ListGroup variant='flush'>
                            <ListGroup.Item>
                                <h2>Order Summary</h2>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Row>
                                    <Col>Items</Col>
                                    <Col>$ {order.itemsPrice}</Col>
                                </Row>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Row>
                                    <Col>Shipping</Col>
                                    <Col>$ {order.shippingPrice}</Col>
                                </Row>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Row>
                                    <Col>Tax</Col>
                                    <Col>$ {order.taxPrice}</Col>
                                </Row>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Row>
                                    <Col>Total</Col>
                                    <Col>$ {order.totalPrice}</Col>
                                </Row>
                            </ListGroup.Item>
                            {!order.isPaid && (
                                <ListGroup.Item>
                                    {loadingPay && <Loader />}
                                    {!sdkReady ? (<Loader />) : (<PayPalButton amount={order.totalPrice} onSuccess={successPaymentHandler} />)}
                                </ListGroup.Item>
                            )}
                            {/* Button to mark the order as delivered */}
                            {loadingDeliver && <Loader />}
                            {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                                <ListGroup.Item>
                                    <Button type='button' className='btn btn-block' onClick={deliverHandler}>
                                        Mark As Delivered
                                    </Button>
                                </ListGroup.Item>
                            )} 
                        </ListGroup>
                    </Card>
                </Col>
            </Row>
        </>
    )
}

export default OrderScreen
