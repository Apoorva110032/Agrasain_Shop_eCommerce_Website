import jwt from 'jsonwebtoken'
import asyncHandler from 'express-async-handler'
import User from '../models/userModel.js'

const protect = asyncHandler(async (req, res, next) => {
    let token
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            //decode the token
            token = req.headers.authorization.split(' ')[1]
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            req.user = await User.findById(decoded.id).select('-password')  //Since we don't want to return password 
            //This req.user will have access to all of our protected routes
            next()
        } catch (error) {
            console.error(error)
            res.status(401)   //Unauthorized client error
            throw new Error('Not authorized, token failed!')
        }
    }

    if (!token) {
        res.status(401)
        throw new Error('Not authorized, no token')
    }
})

const admin = (req, res, next) => {
    if(req.user && req.user.isAdmin) {
        next()
    } else {
        res.status(401) //Not Authorized
        throw new Error('Not Authorized as an Admin!')
    }
}

export { protect, admin }