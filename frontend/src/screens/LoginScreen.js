import React, { useState, useEffect} from 'react'  //Form fields are usually part of component state
import { Link } from 'react-router-dom'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { login } from '../actions/userActions'
import { useDispatch, useSelector } from 'react-redux'
import Loader from '../components/Loader'
import Message from '../components/Message'
import FormContainer from '../components/FormContainer'

const LoginScreen = ({ location, history }) => {

    const [email, setEmail] = useState('') //Setting some fields here for form 
    const [password, setPassword] = useState('')
    const dispatch = useDispatch()  //Defining Dispatch
    //We want to get from our state the user login
    const userLogin = useSelector(state => state.userLogin)  //Through store.js, we are accessing reducer userLoginReducer with userLogin variable
    const { loading, error, userInfo } = userLogin  //The three states are: loading, userInfo & error 
    const redirect = location.search ? location.search.split('=')[1] : '/'

    useEffect(() => {
        if(userInfo){
            history.push(redirect)
        }
    }, [history, userInfo, redirect])

    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(login(email, password))
        //DISPATCH LOGIN 
    }

    return ( 
        <FormContainer>
            <h1>Sign In</h1>
            { error && <Message variant='danger'>{error}</Message> } 
            { loading && <Loader /> }
            <Form onSubmit={submitHandler}>
                <Form.Group controlId='email'>
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control type='email' placeholder='Enter Email' value={ email } onChange={(e) => setEmail(e.target.value)}></Form.Control>
                </Form.Group>
                <Form.Group controlId='password'>
                    <Form.Label>Password</Form.Label>
                    <Form.Control type='password' placeholder='Enter Password' value={ password } onChange={(e) => setPassword(e.target.value)}></Form.Control>
                </Form.Group>
                <Button type='submit' variant='success'>
                    Sign In
                </Button>
            </Form>
            <Row className='py-3'>
                <Col>
                    New Customer? {' '}
                    <Link to={redirect ? `/register?redirect=${redirect}`:'/register'}>
                        Register
                    </Link>
                </Col>
            </Row>
        </FormContainer>
    )
}

export default LoginScreen
