const express = require('express');
const router = express.Router();
const Post = require('../models/post');
const User = require('../models/user');
const Comment = require('../models/comment');

router.post('/new', function (req, res, next) {
    const post = new Post({
        title: req.body.title,
        content: req.body.content,
        user: req.body.user
    });

    post.save()
        .then(_succ => {
            User.findById({"_id" : req.body.user})
                .then(user => {
                    user.posts.push(post)
                    user.save()
                        .then(result => {
                            res.status(200).json({
                                message: 'Post Created',
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
    Post.find()
        .populate('user', ["username", "_id"])
        .populate('comments')
        .then(posts => {
            return res.status(200).json(posts)

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
    Post.findById({ "_id": req.body.id })
        .populate('user', ["username", "_id"])
        .populate('comments')

        .then(post => {
            return res.status(200).json(post)

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

    Post.findOne({ "_id": req.body.id })
        .then(post => {
            if (post["liked_by"].includes(req.body.username)) {
                return res.status(200).json({ "error": "user already liked" })
            }
            else {
                post.liked_by.push(req.body.username)
                post.save()
                    .then(succ => {
                        return res.status(200).json(post)
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