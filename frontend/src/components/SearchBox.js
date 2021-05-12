import React, { useState } from 'react'
import { Form, Button } from 'react-bootstrap'

const SearchBox = ({ history }) => {

    const [keyword, setKeyword] = useState('')

    const submitHandler = (e) => {
        e.preventDefault()  //Since it is a form, so preventDefault()
        if(keyword.trim()){  //Trimming white spaces
            history.push(`/search/${keyword}`)
        } else {
            history.push('/')
        }
    }

    return (
        <Form onSubmit={submitHandler} inline>
            {/* inline form to put it in the header */}
            <Form.Control
                type='text'
                name='q'
                onChange={(e) => setKeyword(e.target.value)}
                placeholder='Search Products...'
                className='mr-sm-2 ml-sm-5'>
            </Form.Control>
            <Button type='submit' variant='outline-success' className='p-2'>Search</Button>
        </Form>
    )
}

export default SearchBox
