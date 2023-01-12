const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler');
const ErrorHandler = require('../utils/errorHandler')
const User = require('../models/User')


const isAuthenticatedUser = asyncHandler(async (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization
    if (!authHeader?.startsWith('Bearer'))
        return next(new ErrorHandler("no token provided, access denied", 401));

    const token = authHeader.split(' ')[1];

    jwt.verify(token,
        process.env.ACCESS_TOKEN_SECRET,
        async (err, decoded) => {
            if (err)
                return next(new ErrorHandler('invalid token, access denied', 401));
            req.user = await User.findById(decoded.id);
            next();
        }
    )
})

const isCurrentUserOrAdmin = asyncHandler(async (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization
    if (!authHeader?.startsWith('Bearer'))
        return next(new ErrorHandler("no token provided, access denied", 401));

    const token = authHeader.split(' ')[1];

    jwt.verify(token,
        process.env.ACCESS_TOKEN_SECRET,
        async (err, decoded) => {
            if (err)
                return next(new ErrorHandler('invalid token, access denied', 401));
            req.user = await User.findById(decoded.id);
            if (req.user.id === req.params.id || req.user.role === 'admin') {
                next();
            } else {
                return next(new ErrorHandler("not allowed, only user himself", 403));
            }
        }
    )
})

const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new ErrorHandler(`Role (${req.user.role}) is not allowed to access this resource`, 403))
        }
        next()
    }
}
module.exports = { isAuthenticatedUser, authorizeRoles, isCurrentUserOrAdmin };
