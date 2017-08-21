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
    router.delete('/post/:id', (req, res) => {
        var params = req.params.id
        Blog.findByIdAndRemove({ _id: params }, {}, (err, posts) => {
            if (err) {
                res.json({ success: false, message: 'Invalid Id' })
            } else {
                res.json({ success: true, message: 'post removed' })
            }
        })
    });
    router.put('/like', (req, res) => {
        if (!req.body.id) {
            res.json({ success: false, message: 'no id was passed' })
        } else {
            Blog.findOne({ _id: req.body.id }, {}, (err, posts) => {
                if (err) {
                    res.json({ success: false, message: 'Invalid Id' })
                } else {
                    if (!posts) {
                        res.json({ success: false, message: 'no post was found' })
                    } else {
                        console.log(req.body.id)
                        console.log(req.body.username)
                        User.findOne({ username: req.body.username }, (err, user) => {
                            if (err) {
                                res.json({ success: false, message: err })
                            } else {
                                if (!user) {
                                    res.json({ success: false, message: 'user not found:' })
                                } else {
                                    if (user.username === posts.createdBy) {
                                        res.json({ success: false, message: 'cannot like your own post' })
                                    } else {
                                        if (posts.likedBy.includes(user.username)) {
                                            res.json({ success: false, message: 'You already liked this post' })
                                        } else {
                                            if (posts.dislikedBy.includes(user.username)) {
                                                posts.dislikes--;
                                                const ArrayIndex = posts.dislikedBy.indexOf(user.username)
                                                posts.dislikedBy.splice(ArrayIndex, 1)
                                                posts.likes++
                                                    posts.likedBy.push(user.username)
                                                posts.save((err) => {
                                                    if (err) {
                                                        res.json({ success: false, message: 'something went wrong' })
                                                    } else {
                                                        res.json({ success: true, message: 'post liked!' })
                                                    }
                                                })
                                            } else {
                                                posts.likes++
                                                    posts.likedBy.push(user.username)
                                                posts.save((err) => {
                                                    if (err) {
                                                        res.json({ success: false, message: 'something went wrong' })
                                                    } else {
                                                        res.json({ success: true, message: 'post liked!' })
                                                    }
                                                })
                                            }
                                        }
                                    }
                                }
                            }
                        })
                    }
                }
            })

        }
    });
    router.put('/dislike', (req, res) => {
        if (!req.body.id) {
            res.json({ success: false, message: 'no id was passed' })
        } else {
            Blog.findOne({ _id: req.body.id }, {}, (err, posts) => {
                if (err) {
                    res.json({ success: false, message: 'Invalid Id' })
                } else {
                    if (!posts) {
                        res.json({ success: false, message: 'no post was found' })
                    } else {
                        console.log(req.body.id)
                        console.log(req.body.username)
                        User.findOne({ username: req.body.username }, (err, user) => {
                            if (err) {
                                res.json({ success: false, message: err })
                            } else {
                                if (!user) {
                                    res.json({ success: false, message: 'user not found:' })
                                } else {
                                    if (user.username === posts.createdBy) {
                                        res.json({ success: false, message: 'cannot dislike your own post' })
                                    } else {
                                        if (posts.dislikedBy.includes(user.username)) {
                                            res.json({ success: false, message: 'You already disliked this post' })
                                        } else {
                                            if (posts.likedBy.includes(user.username)) {
                                                posts.likes--;
                                                const ArrayIndex = posts.likedBy.indexOf(user.username)
                                                posts.likedBy.splice(ArrayIndex, 1)
                                                posts.dislikes++
                                                    posts.dislikedBy.push(user.username)
                                                posts.save((err) => {
                                                    if (err) {
                                                        res.json({ success: false, message: 'something went wrong' })
                                                    } else {
                                                        res.json({ success: true, message: 'post disliked!' })
                                                    }
                                                })
                                            } else {
                                                posts.dislikes++
                                                    posts.dislikedBy.push(user.username)
                                                posts.save((err) => {
                                                    if (err) {
                                                        res.json({ success: false, message: 'something went wrong' })
                                                    } else {
                                                        res.json({ success: true, message: 'post disliked!' })
                                                    }
                                                })
                                            }
                                        }
                                    }
                                }
                            }
                        })
                    }
                }
            })

        }
    });
    // comments
    router.post('/comments', (req, res) => {
        req.checkBody('id', 'id is required').notEmpty()
        req.checkBody('comment', 'comment is required').notEmpty()
        req.checkBody('username', 'username is required').notEmpty()
        var errors = req.validationErrors();
        if (errors) {
            console.log(errors)
            res.send(errors)
        } else {
            Blog.findOne({ _id: req.body.id }, (err, post) => {
                if (err) {
                    res.json({ success: false, message: err })
                } else {
                    if (!post) {
                        res.json({ success: false, message: 'no post found' })
                    } else {
                        User.findOne({ username: req.body.username }, (err, user) => {
                            if (err) {
                                res.json({ success: false, message: err })
                            } else {
                                if (!user) {
                                    res.json({ success: false, message: 'user not found' })
                                } else {
                                    console.log(req.body.comment)
                                    post.comments.push({
                                        comment: req.body.comment,
                                        commentator: user.username
                                    })
                                    post.save((err) => {
                                        if (err) {
                                            res.json({ success: false, message: 'err commenting' })
                                        } else {
                                            res.json({ success: true, message: 'comment saved' })
                                        }
                                    })
                                }
                            }
                        })
                    }
                }
            })
        }
    })

    return router
}