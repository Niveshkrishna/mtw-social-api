const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const commentSchema = new Schema({
    content: {
        type: String,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true

    },
    post: {
        type: Schema.Types.ObjectId,
        ref: 'Post',
        required: true

    },

    liked_by: {
        type: [String]
    },

    replied_to :{
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    }

});


module.exports = mongoose.model('Comment', commentSchema);
