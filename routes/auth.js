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
                        res.json({ success: false, message: "Username or Email already exist" })
                    } else {
                        res.json({ success: false, message: "Could not save user", err })
                    }
                } else {
                    res.json({ success: true, message: "User saved to db" })
                }
            })

        }
    })

    router.get('/checkEmail/:email', (req, res) => {
        if (!req.params.email) {
            res.json({ success: false, message: 'E-mail was not provided' });
        } else {
            User.findOne({ email: req.params.email }, (err, user) => {
                if (err) {
                    res.json({ success: false, message: err })
                } else {
                    if (user) {
                        res.json({ success: false, message: 'E-mail is already taken' })
                    } else {
                        res.json({ success: true, message: 'Email is available' })
                    }
                }


            })
        }
    });
    router.get('/checkUsername/:username', (req, res) => {
        if (!req.params.username) {
            res.json({ success: false, message: 'Username was not provided' });
        } else {
            User.findOne({ username: req.params.username }, (err, user) => {
                if (err) {
                    res.json({ success: false, message: err })
                } else {
                    if (user) {
                        res.json({ success: false, message: 'Username is already taken' })
                    } else {
                        res.json({ success: true, message: 'Username is available' })
                    }
                }


            })
        }
    })
    return router
}