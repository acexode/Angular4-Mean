const User = require('../models/user.js'),
    Blog = require('../models/blog.js'),
    jwt = require('jsonwebtoken'),
    config = require('../config/db');

module.exports = (router) => {

    router.post('/newBlog', (req, res) => {
        req.checkBody('title', 'title is required').notEmpty()
        req.checkBody('body', 'body is required').notEmpty()
        req.checkBody('createdBy', 'Author is required').notEmpty()
        var errors = req.validationErrors();
        if (errors) {
            console.log(errors)
            res.send(errors)
        } else {
            let blog = new Blog({
                title: req.body.title,
                body: req.body.body,
                createdBy: req.body.createdBy
            });
            blog.save((err) => {
                if (err) {
                    if (err.errors) {
                        if (err.errors.title) {
                            res.json({ success: false, message: err.errors.title.message })
                        } else {
                            if (err.errors.body) {
                                res.json({ success: false, message: err.errors.body.message })
                            } else {
                                res.json({ success: false, message: err.errmsg })
                            }
                        }
                    } else {
                        res.json({ success: false, message: err })
                    }
                } else {
                    res.json({ success: true, message: "Blog saved to db" })
                }
            })
        }
    });

    router.get('/post', (req, res) => {
        Blog.find({}, {}, (err, posts) => {
            if (err) {
                res.json({ success: false, message: err })
            } else {
                if (!posts) {
                    res.json({ success: false, message: 'no post' })
                } else {
                    res.json({ success: true, posts: posts })
                }
            }
        }).sort({ '_id': -1 })
    });
    router.get('/post/:id', (req, res) => {
        var params = req.params.id
        Blog.findOne({ _id: params }, {}, (err, posts) => {
            if (err) {
                res.json({ success: false, message: err })
            } else {
                if (!posts) {
                    res.json({ success: false, message: 'no post' })
                } else {
                    res.json({ success: true, posts: posts })
                }
            }
        })
    });
    router.put('/post/:id', (req, res) => {
        var params = req.params.id
        Blog.findOne({ _id: params }, {}, (err, posts) => {
            if (err) {
                res.json({ success: false, message: err })
            } else {
                if (!posts) {
                    res.json({ success: false, message: 'no post' })
                } else {
                    posts.title = req.body.title
                    posts.body = req.body.body
                    posts.save((err) => {
                        if (err) {
                            res.json({ success: false, message: err })
                        } else {
                            res.json({ success: true, message: 'post updated' })
                        }
                    })
                }
            }
        })
    });

    return router
}