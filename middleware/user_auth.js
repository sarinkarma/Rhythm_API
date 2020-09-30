const jwt = require('jsonwebtoken')
const User = require('../models/user')

const auth = async(req, res, next) => {
    let token = req.header('Authorization')
    if (token) {
        if (token.startsWith('Bearer ')) {
            // Remove Bearer from string
            token = token.slice(7, token.length);
        }

        jwt.verify(token, 'user@123', (err, data) => {
            if(err){
                res.json({
                    status: 400,
                    message: 'Not authorized to access this resource'
                })
            }else{
                try {
                    const user = User.findOne({ _id: data._id, 'tokens.token': token })
                    req.user = user
                    req.user_id = data._id
                    req.token = token
                    next()
                } catch (error) {
                    res.status(401).send({ error: 'Not authorized to access this resource' })
                }
            }
        })
        

    }else{
        return res.json({
            status: 400,
            message: 'Auth token is not supplied'
          });
    }

}

module.exports = auth
