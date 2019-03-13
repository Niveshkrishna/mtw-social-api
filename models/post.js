const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./user');

const postSchema = new Schema({
    title : {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true

    },

    comments : [{ type: Schema.Types.ObjectId, ref: 'Comment' }],

    liked_by: {
        type: [String]
    }

});


module.exports = mongoose.model('Post', postSchema);
