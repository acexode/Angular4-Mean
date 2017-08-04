var User = require('../models/user.js')

module.exports = (router) => {

    router.post('/register', (req, res) => {
        body = req.body.email
        username = req.body.username
        password = req.body.password
        req.checkBody('email', 'email is required').notEmpty()
        req.checkBody('email', 'invalid email').isEmail()
        req.checkBody('username', 'username is required').notEmpty()
        req.checkBody('password', 'password is required').notEmpty()
        var errors = req.validationErrors();
        if (errors) {
            console.log(errors)
            res.send(errors)
        } else {
            let user = new User({
                email: req.body.email.toLowerCase(),
                username: req.body.username.toLowerCase(),
                password: req.body.password
            });
            // Save user to database
            user.save((err) => {
                if (err) {
                    if (err.code === 11000) {
                        res.json({ success: false, message: "Username or email already exist" })
                    } else {
                        res.json({ success: false, message: "could not save user", err })
                    }
                } else {
                    res.json({ success: true, message: "user saved to db" })
                }
            })

        }
    })
    return router
}