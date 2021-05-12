import React, { useEffect } from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { Table, Button } from 'react-bootstrap'
import { listUsers, deleteUser } from '../actions/userActions'
import { useDispatch, useSelector } from 'react-redux'
import Loader from '../components/Loader'
import Message from '../components/Message'

const UserListScreen = ({ history }) => {
    const dispatch = useDispatch()
    const userList = useSelector(state => state.userList)      //Bring in state
    const { loading, users, error } = userList

    const userLogin = useSelector(state => state.userLogin)      //Bring in state
    const { userInfo } = userLogin

    const userDelete = useSelector(state => state.userDelete)      //Bring in that part of the state
    const { success: successDelete } = userDelete

    useEffect(() => {
        if(userInfo && userInfo.isAdmin) { //if(userInfo) means if logged in, because screens are visible even without being logged in in few cases
            dispatch(listUsers())
        } else {
            history.push('/login')
        }
    }, [dispatch, history, userInfo, successDelete]) //Dependency Array 
    //If successDelete i.e. deleted a user successfully, then also it will dispatch listUsers again

    const deleteHandler = (id) => {
        if(window.confirm('Are You Sure?')){
            dispatch(deleteUser(id))
        }
        //window.confirm() instructs browser to display a dialog with an optional message, and to wait until user either confirms or cancels dialog.
    }

    return (<>
        <h1>Users</h1>
        {loading ? <Loader /> : error ? <Message variant='danger'>{error}</Message> : (
            <Table striped bordered hover responsive className='table-sm'>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>NAME</th>
                        <th>EMAIL</th>
                        <th>ADMIN</th>
                        <th>EDIT/DELETE</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user._id}>
                            <td>{user._id}</td>
                            <td>{user.name}</td>
                            <td><a href={`mailto:${user.email}`}>{user.email}</a></td>
                            <td>
                                {user.isAdmin ? (
                                    <i className='fas fa-check' style={{ color: 'green' }}></i>
                                ) : (
                                    <i className='fas fa-times' style={{ color: 'red' }}></i>
                                )}
                            </td>
                            <td>
                                <LinkContainer to={`/admin/user/${user._id}/edit`}>
                                    <Button variant='light' className='btn-sm'>
                                        <i className='fas fa-edit'></i>
                                    </Button>
                                </LinkContainer>
                                <Button variant='danger' className='btn-sm' onClick={() => deleteHandler(user._id)}>
                                    <i className='fas fa-trash'></i>
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        )}
    </>
    )
}

export default UserListScreen
