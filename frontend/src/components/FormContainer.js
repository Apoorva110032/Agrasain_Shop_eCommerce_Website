//Since a lot of Forms are going to have some of the similar styles, therefore created this Form Container Component
import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'

const FormContainer = ({ children }) => {
    return (
        <Container>
            <Row className='justify-content-md-center'>
                <Col xs={12} md={6}>
                    { children }
                </Col>
            </Row>
        </Container>
    )
}

export default FormContainer
