import React from 'react'
import { Pagination } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'

const Paginate = ({ pages, page, isAdmin = false, keyword = '' }) => {
    return pages > 1 && (
        //Map through whatever the number of pages (keys) is
        //x - index (key)
        <Pagination>
            {[...Array(pages).keys()].map(x => (
                <LinkContainer key={x + 1} to={!isAdmin ? (
                    keyword ? `/search/${keyword}/page/${x + 1}` : `/page/${x + 1}`
                ) : (
                    `/admin/productlist/${x + 1}`
                )}>
                    <Pagination.Item active={x + 1 === page}>{x + 1}</Pagination.Item>
                    {/* That Pagination Item should be active whose number = the page number on which we are */}
                </LinkContainer>
            ))}
        </Pagination>
    )
}

export default Paginate
