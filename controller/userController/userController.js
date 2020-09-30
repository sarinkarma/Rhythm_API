User = require('../../models/user');
const bcrypt = require('bcryptjs')

exports.update = function(req, res){
    User.findByIdAndUpdate(req.params.user_id, {
        username: req.body.username,
        gender: req.body.gender,
        dob: req.body.dob
    }).then(val => {
        User.findById(val._id).then(user => {
            res.send({
                status: 200,
                message: "User updated successfully",
                data: user
            })
        })
    }).catch(err => {
        res.send({
           message: err.message
        })
    })
}

exports.updatePassword = async function(req, res){
    var oldpass = req.body.oldpass;
    var user = await User.findById(req.params.user_id);

    
    var compare = await bcrypt.compare(oldpass, user.password)
    if (!compare) {
        return res.send({
            status: 400,
            message: "Password doesnot match"
        })
    }

    User.findByIdAndUpdate(req.params.user_id, {
        password: await bcrypt.hash(req.body.password, 8)
    }).then(val => {
        res.send({
            status: 200,
            message: "Updated successfully"
        })
    }).catch(err => {
        res.send({
            message: err.message
        })
    })
}

exports.updateImage = function(req, res){
    req.files.map(function(item){
        var image = item.filename

        User.findByIdAndUpdate(req.params.user_id, {
            image: image,
        }).then(val => {
            User.findById(val._id).then(user => {
                res.send({
                    status: 200,
                    message: "updated successfully",
                    data: user
                })
            })
        }).catch(err => {
            res.send({
            message: err.message
            })
        })

    })
}