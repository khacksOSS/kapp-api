const mongoose = require('mongoose')

const articleSchema = new mongoose.Schema({
    title : {
        type: String,
        required: true
    },
    description : {
        type: String,
        required: true
    },
    time : {
        type : Date,
        required: true,
        default: Date.now
    },
    author : {
        type : String,
        required: true
    },
    tags : {
        type : [String],
        required : true
    }
})

module.exports = mongoose.model('Article', articleSchema)