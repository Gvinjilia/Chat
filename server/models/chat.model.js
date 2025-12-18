const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required for the group chat!']
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    members: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
            required: [true, 'You should add at least one member in a group chat']
        }
    ]
}, { timestamps: true });


const Chat = mongoose.model('chat', ChatSchema);

module.exports = Chat;