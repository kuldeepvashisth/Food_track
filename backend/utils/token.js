const jwt = require('jsonwebtoken')

function generateToken(userId) {
    try {
        // use expiresIn and a safe env var name
        const token = jwt.sign({ userId }, process.env.JWTsecret || process.env.JWT_SECRET || 'secret', { expiresIn: '7d' })
        return token
    } catch (err) {
        throw err
    }
}

module.exports = generateToken