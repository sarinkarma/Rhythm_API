const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        require: true,
        minLength: 8
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: value => {
            if(!validator.isEmail(value)){
                throw new Error({error: 'Invalid Email Address'})
            }
        }
    },
    gender: String,
    dob: String,
    image: String,
    account: String,
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }] ,
    
},
{
  timestamps: true
});

userSchema.pre('save', async function (next) {
    // Hash the password before saving the user model
    const user = this
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})

userSchema.methods.generateAuthToken = async function() {
    // Generate an auth token for the user
    const user = this
    const token = jwt.sign({_id: user._id}, 'user@123')
    user.tokens = user.tokens.concat({token})
    await user.save()
    return token
}

userSchema.statics.findByCredentials = async (email, password) => {
    // Search for a student by email and password.
    const user = await User.findOne({email: email, account: 'Account'} )
    if (!user) {
        throw new Error({ error: 'Invalid login credentials' })
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password)
    if (!isPasswordMatch) {
        throw new Error({ error: 'Invalid login credentials' })
    }
    return user
}

userSchema.statics.emailCheck = async(email) => {
    const user = await User.findOne({email} )
    if (!user) {
        return false
    }else{
        return true
    }
}

const User = mongoose.model('user', userSchema);
module.exports = User;