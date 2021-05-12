import React, { useEffect } from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { Table, Button, Row, Col } from 'react-bootstrap'
import { listProducts, deleteProduct, createProduct } from '../actions/productActions'
import { PRODUCT_CREATE_RESET } from '../constants/productConstants'
import { useDispatch, useSelector } from 'react-redux'
import Loader from '../components/Loader'
import Message from '../components/Message'
import Paginate from '../components/Paginate'

const ProductListScreen = ({ history, match }) => {
    const pageNumber = match.params.pageNumber || 1  //page - Number format, pageNumber - not Number format

    const dispatch = useDispatch()
    const productList = useSelector(state => state.productList)      //Bring in state
    const { loading, products, error, pages, page } = productList

    const productDelete = useSelector(state => state.productDelete)      //Bring in state
    const { loading: loadingDelete, success: successDelete, error: errorDelete } = productDelete

    const productCreate = useSelector(state => state.productCreate)      //Bring in state
    const { loading: loadingCreate, success: successCreate, error: errorCreate, product: createdProduct } = productCreate

    const userLogin = useSelector(state => state.userLogin)      //Bring in state
    const { userInfo } = userLogin

    useEffect(() => {
        dispatch({ type: PRODUCT_CREATE_RESET })
        if (!userInfo.isAdmin) {
            history.push('/login')
        } 

        if(successCreate) {
            history.push(`/admin/product/${createdProduct._id}/edit`)
        } else {
            dispatch(listProducts('', pageNumber))
        }
    }, [dispatch, history, userInfo, successDelete, successCreate, createdProduct, pageNumber]) //Dependency Array 
    //If successDelete i.e. deleted a product successfully, then also it will dispatch listProducts again with deleted product gone

    const deleteHandler = (id) => {
        if (window.confirm('Are You Sure?')) {
            dispatch(deleteProduct(id))
        }
        //window.confirm() instructs browser to display a dialog with an optional message, and to wait until user either confirms or cancels dialog.
    }

    const createProductHandler = () => {
        dispatch(createProduct())  
        //Clicking on Create Product will create a product (like an existence of some product with some default values). 
        //Check those default values in createProduct controller. 
        //It then resets it.
        //It then redirects us to its edit page i.e. /admin/product/${createdProduct._id}/edit.
    }

    return (<>
        <Row className='align-items-center'>
            <Col>
                <h1>Products</h1>
            </Col>
            <Col className='text-right'>
                <Button className='my-3' onClick={createProductHandler}>
                    <i className='fas fa-plus'></i> Create Product
                </Button>
            </Col>
        </Row>
        {loadingDelete && <Loader />}
        {errorDelete && <Message variant='danger'>{errorDelete}</Message>}
        {loadingCreate && <Loader />}
        {errorCreate && <Message variant='danger'>{errorCreate}</Message>}
        {loading ? <Loader /> : error ? <Message variant='danger'>{error}</Message> : (<>
            <Table striped bordered hover responsive className='table-sm'>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>NAME</th>
                        <th>PRICE</th>
                        <th>CATEGORY</th>
                        <th>BRAND</th>
                        <th>EDIT/DELETE</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map(product => (
                        <tr key={product._id}>
                            <td>{product._id}</td>
                            <td>{product.name}</td>
                            <td>$ {product.price}</td>
                            <td>{product.category}</td>
                            <td>{product.brand}</td>
                            <td>
                                <LinkContainer to={`/admin/product/${product._id}/edit`}>
                                    <Button variant='light' className='btn-sm'>
                                        <i className='fas fa-edit'></i>
                                    </Button>
                                </LinkContainer>
                                <Button variant='danger' className='btn-sm' onClick={() => deleteHandler(product._id)}>
                                    <i className='fas fa-trash'></i>
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <Paginate pages={pages} page={page} isAdmin={true} />
            </>
        )}
    </>
    )
}

export default ProductListScreen
