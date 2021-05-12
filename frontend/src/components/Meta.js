import { Helmet } from 'react-helmet'
import React from 'react'

const Meta = ({ title, description, keywords }) => {
    return (
        <Helmet>
            <title>{title}</title>
            <meta name='description' content={description} />
            <meta name='keywords' content={keywords} />
        </Helmet>
    )
}

Meta.defaultProps = {
    title: 'Welcome to Agrasain_Shop',
    description: 'We sell the Best Products for cheap!',
    keywords: 'Electronics, Cheap Electronics, Buy Electronics'
}

export default Meta
