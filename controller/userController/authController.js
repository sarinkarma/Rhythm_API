User = require('../../models/user');

exports.signup = async function(req, res){
    User.findOne({email: req.body.email, account: req.body.account}, async function(err, value){
        if(err){
            return res.status(500).send('Error on server');
        }

        if(value){
            const token = await value.generateAuthToken()
            res.send({ 
                status: 200,
                message: 'Login successful',
                data: value,
                token: token
             })
        }else{
            try{
                const emailcheck = await User.emailCheck(req.body.email);
                if(emailcheck){
                    return res.json({
                        status : 400,
                        message: "Email already exists"
                    })
                }
                var user = new User();
                user.username = req.body.username;
                user.password = req.body.password;
                user.gender = req.body.gender;
                user.email = req.body.email;
                user.dob = req.body.dob;
                user.account = req.body.account;

                await user.save();
                const token = await user.generateAuthToken();
                res.json({
                    message: "User Registered Successfully",
                    status: 200,
                    data: user,
                    token: token,
                })
            } catch (error){
                res.status(400).send(error.message)
            }
        }
    })
}

exports.login = async function(req, res){
    try {
        const { email, password } = req.body
        const user = await User.findByCredentials(email, password)
        if (!user) {
            return res.status(401).send({error: 'Login failed! Check authentication credentials'})
        }
        const token = await user.generateAuthToken()
        const val = await User.findById(user._id);
        res.send({ 
            status: 200,
            message: 'Login successful',
            data: val,
            token: token
         })
    } catch (error) {
        res.json({
            status: 400,
            message: error
        })
    }
}

exports.logout = async function(req, res){
    // Log user out of the application
    try {
        var user = await req.user;
        user.tokens = user.tokens.filter((token) => {
            return token.token != req.token
        })
        await user.save()
        res.send({
            status: 200,
            message: 'Logout successful'
        })
    } catch (error) {
        res.status(500).send(error.message)
    }

}

exports.emailCheck = async function(req, res) {
    const eemail = req.body.email;
    const user = await User.findOne({email: eemail, account: "Account"})
    if (!user) {
        res.json({
            status: 200,
            message: "Email does not exist"
        })
    }else{
        res.json({
            status: 400,
            message: "Email already exists"
        })
    }
}