const asyncHandler = require('express-async-handler')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const User = require('../models/userModel')

// @desc  Register new user
// route  POST /api/users
// @access Public
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
        res.status(400)
        throw new Error('Please add all the fields')
    }

    // Check if user exist
    const userExist = await User.findOne({ email })

    if (userExist) {
        res.status(400)
        throw new Error('user already exist')
    }

    //Hash password
    //1.generate salt
    const salt = await bcrypt.genSalt(10)
    //2.hashed the password
    const hashedPassword = await bcrypt.hash(password, salt)

    //Create User
    const user = await User.create(
        {
            name,
            email,
            password: hashedPassword,

        })

    if (user) {
        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: email,
            token: generateToken(user._id)
        })
    }
    else {
        res.status(400)
        throw new error('Invalid User Data')
    }

})
// @desc  Authenticate a user
// route  POST /api/users/login
// @access Public
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body

    //Check for user email
    const user = await User.findOne({ email })
    if (user && (await bcrypt.compare(password, user.password))) {
        res.json({
            _id: user.id,
            name: user.name,
            email: email,
            token: generateToken(user._id)
        })

    }
    else {
        res.status(400)
        throw new error('Invalid Credentials')
    }

}

)
// @desc  Get user data
// route  GET /api/users/me
// @access Private
const getMe = asyncHandler(async (req, res) => {
    const { _id, name, email } = await User.findById(req.user.id)

    res.status(200).json({
        id: _id,
        name,
        email
    })
    res.json({ message: 'User data display' })
})

//Generate a Token

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' })
}
module.exports = {
    registerUser: registerUser,
    loginUser: loginUser,
    getMe: getMe,
}

