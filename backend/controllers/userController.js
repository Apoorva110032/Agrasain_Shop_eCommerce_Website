import asyncHandler from 'express-async-handler'
import User from '../models/userModel.js'
import generateToken from '../utils/generateToken.js'

// @desc Authenticate the user (validate the e-mail & pwd) & get (send back) token to save on client to access protected routes later
// @route POST /api/users/login
// @access Public
const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    const user = await User.findOne({ email })

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id)
        })
    } else {
        res.status(401)
        throw new Error('Invalid email or password')
    }
})

// @desc Register a new user
// @route POST /api/users
// @access Public
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body
    const userExists = await User.findOne({ email })
    if (userExists) {
        res.status(400)  //Error for Bad Request
        throw new Error('User already exists!')
    }

    const user = await User.create({
        name,
        email,
        password
    })

    if (user) {
        res.status(201).json({  //Status for something created 
            _id: user._id,
            name: user.name,    //Sending the same kind of data as sent while logging in, for user authentication right after registration 
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id)  //To authenticate right after registration 
        })

    } else {
        res.status(400)
        throw new Error('Invalid User Data!')
    }

})

// @desc Get User Profile
// @route GET /api/users/profile
// @access Private
const getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)
    if (user) {
        res.json({    //return this for the login user
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin
        })

    } else {
        res.status(404)
        throw new Error('User not found')
    }
})

// @desc Update User Profile
// @route PUT /api/users/profile
// @access Private
const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)  //finding from logged in user
    if (user) {

        user.name = req.body.name || user.name
        user.email = req.body.email || user.email
        if (req.body.password) {
            user.password = req.body.password
        }
        const updateUser = await user.save()

        res.json({
            _id: updateUser._id,
            name: updateUser.name,
            email: updateUser.email,
            isAdmin: updateUser.isAdmin,
            token: generateToken(updateUser._id)
        })
    } else {
        res.status(404)
        throw new Error('User not found')
    }
})

// @desc Get All Users
// @route GET /api/users
// @access Private/Admin
const getUsers = asyncHandler(async (req, res) => {
    const users = await User.find({})
    res.json(users)
})

// @desc Delete A User
// @route DELETE /api/users/:id
// @access Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id) //req.body is used to access actual form data, req.params is used for route parameters
    if (user) {
        await user.remove()
        res.json({ message: 'User Removed!' })
    } else {
        res.status(404)
        throw new Error('User Not Found!')
    }
})

// @desc Get User by ID
// @route GET /api/users/:id
// @access Private/Admin
const getUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select('-password')
    if (user) {
        res.json(user)  //Send the user back - After that we want to update profile
    } else {
        res.status(404)
        throw new Error('User Not Found!')
    }
})

// @desc Update User
// @route PUT /api/users/:id
// @access Private/Admin
const updateUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id)  //Get user from ID
    if (user) {

        user.name = req.body.name || user.name
        user.email = req.body.email || user.email
        user.isAdmin = req.body.isAdmin

        const updateUser = await user.save()

        res.json({
            _id: updateUser._id,
            name: updateUser.name,
            email: updateUser.email,
            isAdmin: updateUser.isAdmin,
        })
    } else {
        res.status(404)
        throw new Error('User not found')
    }
})

export { authUser, registerUser, getUserProfile, updateUserProfile, getUsers, deleteUser, getUserById, updateUser }