const jwt = require('jsonwebtoken')


const createAccessToken = (id) => {
    return jwt.sign({ id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' })
}

module.exports = { createAccessToken }
