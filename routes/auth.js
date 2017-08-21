const User = require('../models/user.js'),
    jwt = require('jsonwebtoken'),
    config = require('../config/db');

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
    });
    router.post('/login', (req, res) => {

        req.checkBody('username', 'username is required').notEmpty()
        req.checkBody('password', 'password is required').notEmpty()
        var errors = req.validationErrors();
        if (errors) {
            console.log(errors)
            res.send(errors)
        } else {
            User.findOne({ username: req.body.username.toLowerCase() }, (err, user) => {
                if (err) {
                    res.json({ success: false, message: err })
                    console.log(err)
                } else {
                    if (!user) {
                        res.json({ success: false, message: 'username not found' })
                    } else {
                        const validPassword = user.comparePassword(req.body.password)
                        if (!validPassword) {
                            res.json({ success: false, message: 'Invalid password' })
                        } else {
                            var token = jwt.sign({ userId: user._id }, config.secret, { expiresIn: '24h' })
                            res.json({ success: true, message: 'success', token: token, user: { username: user.username, email: user.email } })
                                //console.log(user)
                        }

                    }

                }
            })
        }
    });

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
    });
    // router.use((req, res, next) => {
    //         const token = req.headers['authorization']
    //         if (!token) {
    //             res.json({ success: false, message: 'token not provided' })
    //         } else {
    //             jwt.verify(token, config.secret, (err, decoded) => {
    //                 if (err) {
    //                     res.json({ success: false, message: 'token invalid:' + err })

    //                 } else {
    //                     req.decoded = decoded
    //                     next();
    //                 }
    //             })
    //         }
    //     })
    // router.get('/profile', (req, res) => {
    //     User.findOne({ _id: req.decoded.userId }).select('username email').exec((err, user) => {
    //         if (err) {
    //             res.json({ success: false, message: err })
    //         } else {
    //             if (!user) {
    //                 res.json({ success: false, message: 'user not found:' + err })
    //             } else {
    //                 res.json({ success: true, user: user })
    //             }
    //         }
    //     })


    // })

    return router
}