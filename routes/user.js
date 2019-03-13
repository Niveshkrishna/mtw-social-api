const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/user');

router.post('/new', function (req, res, next) {
    const user = new User({
        username: req.body.username,
        password: bcrypt.hashSync(req.body.password, 10)
    });

    user.save().then(result => {
        res.status(200).json({
            message: 'User Created',
            obj: result
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


router.post('/', (req, res, next) => {
    User.findOne({ username: req.body.username })
        .then(user => {
            if (!user || !bcrypt.compareSync(req.body.password, user.password)) {
                return res.status(401).json({
                    title: 'No hiking please!!! Unauthorized!!',
                    error: {
                        message: 'Invalid Login Credentials'
                    }
                });
            }
            else {
                res.status(200).json({
                    title: 'Login successful. Credentials are matched',
                    userId: user._id
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                title: 'An Error Occurred',
                error: err
            });
        });
})
module.exports = router;