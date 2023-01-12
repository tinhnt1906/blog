const User = require('../models/User')
const asyncHandler = require('express-async-handler');
const ErrorHandler = require('../utils/errorHandler')
const { createAccessToken } = require('../utils/jwtToken')

const register = asyncHandler(async (req, res, next) => {
    const { email, username, password } = req.body;

    let user = await User.findOne({ email }).exec();
    if (user)
        return next(new ErrorHandler('This email is already used.', 409));

    user = await User.create({ email, username, password });
    await user.save();

    res.status(201).json({ success: true, user });
});


const login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user)
        return next(new ErrorHandler(`user ${email} not found`, 404))

    const isPasswordMatch = await user.comparePassword(password)
    if (!isPasswordMatch)
        return next(new ErrorHandler(`password invalid`, 404))

    const accessToken = createAccessToken(user._id)
    res.status(200).json({ success: true, accessToken, user });
});

module.exports = {
    register,
    login
};