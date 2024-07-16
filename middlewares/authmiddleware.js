

const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    try {
        // Log headers for debugging
       
        
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
      
        console.log('Decoded:', decoded);
        // Check if decoded has id field
        if (decoded && decoded.id) {
            req.body.userid = decoded.id;
        } else {
            throw new Error('Invalid JWT format or missing user id');
        }

       
        
        next();
    } catch (error) {
        console.error('JWT verification error:', error.message);
        res.status(401).send({ success: false, message: "Invalid Token!!" });
    }
};
