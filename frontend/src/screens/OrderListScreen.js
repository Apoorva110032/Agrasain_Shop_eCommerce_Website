import React, { useEffect } from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { Table, Button } from 'react-bootstrap'
import { listOrders } from '../actions/orderActions'
import { useDispatch, useSelector } from 'react-redux'
import Loader from '../components/Loader'
import Message from '../components/Message'

const OrderListScreen = ({ history }) => {
    const dispatch = useDispatch()
    const orderList = useSelector(state => state.orderList)      //Bring in state
    const { loading, orders, error } = orderList

    const userLogin = useSelector(state => state.userLogin)      //Bring in state
    const { userInfo } = userLogin

    useEffect(() => {
        if(userInfo && userInfo.isAdmin) { //if(userInfo) means if logged in, because screens are visible even without being logged in in few cases
            dispatch(listOrders())
        } else {
            history.push('/login')
        }
    }, [dispatch, history, userInfo]) //Dependency Array 

    return (<>
        <h1>Orders</h1>
        {loading ? <Loader /> : error ? <Message variant='danger'>{error}</Message> : (
            <Table striped bordered hover responsive className='table-sm'>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>USER</th>
                        <th>DATE</th>
                        <th>TOTAL PRICE</th>
                        <th>PAID</th>
                        <th>DELIVERED</th>
                        <th>DETAILS</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map(order => (
                        <tr key={order._id}>
                            <td>{order._id}</td>
                            <td>{order.user && order.user.name}</td>
                            <td>{order.createdAt.substring(0, 10)}</td>
                            <td>$ {order.totalPrice}</td>
                            <td>{order.isPaid ? order.paidAt.substring(0, 10) : (<i className='fas fa-times' style={{ color: 'red' }}></i>)}</td>
                            <td>{order.isDelivered ? order.deliveredAt.substring(0, 10) : (<i className='fas fa-times' style={{ color: 'red' }}></i>)}</td>    
                            <td>
                                <LinkContainer to={`/order/${order._id}`}>
                                    <Button variant='light' className='btn-sm'>
                                        Details   
                                    </Button>
                                </LinkContainer>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        )}
    </>
    )
}

export default OrderListScreen
