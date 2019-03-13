const express = require('express');
const router = express.Router();
const Comment = require('../models/comment');
const User = require('../models/user');
const Post = require('../models/post');

router.post('/new', function (req, res, next) {
    const comment = new Comment({
        content: req.body.content,
        user: req.body.user,
        post: req.body.post,
        replied_to: req.body.reply
    });

    comment.save()
        .then(_succ => {
            User.findById({ "_id": req.body.user })
                .then(user => {
                    user.comments.push(comment)
                    user.save()
                        .then(succ => {
                            Post.findById({ "_id": req.body.post })
                                .then(post => {
                                    post.comments.push(comment)
                                    post.save()
                                        .then(result => {
                                            res.status(200).json({
                                                message: 'Comment Created',
                                                obj: _succ
                                            });
                                        })
                                        .catch(err => {
                                            console.log(err);
                                            res.status(500).json({
                                                title: 'An Error Occurred',
                                                error: err
                                            });
                                        });


                                }).catch(err => {
                                    console.log(err);
                                    res.status(500).json({
                                        title: 'An Error Occurred',
                                        error: err
                                    });
                                });

                        })
                        .catch(err => {
                            console.log(err);
                            res.status(500).json({
                                title: 'An Error Occurred',
                                error: err
                            });
                        });

                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json({
                        title: 'An Error Occurred',
                        error: err
                    });
                });


        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                title: 'An Error Occurred',
                error: err
            });
        });

});


router.get('/', (req, res, next) => {
    Comment.find({})
        .populate('user', ["username", "_id"])
        .then(comments => {
            return res.status(200).json(comments)

        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                title: 'An Error Occurred',
                error: err
            });
        });
})

router.get('/id', (req, res, next) => {
    Comment.findById({ "_id": req.body.id })
        .populate('user', ["username", "_id"])
        .then(comment => {
            return res.status(200).json(comment)

        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                title: 'An Error Occurred',
                error: err
            });
        });
})

router.post('/id/like', (req, res, next) => {

    Comment.findOne({ "_id": req.body.id })
        .then(comment => {
            if (comment["liked_by"].includes(req.body.username)) {
                return res.status(200).json({ "error": "user already liked" })
            }
            else {
                comment.liked_by.push(req.body.username)
                comment.save()
                    .then(_succ => {
                        return res.status(200).json(comment)
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(500).json({
                            title: 'An Error Occurred',
                            error: err
                        });
                    })

            }

        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                title: 'An Error Occurred',
                error: err
            });
        })
})

module.exports = router;