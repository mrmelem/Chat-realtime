const mongoose = require('mongoose')
const msgSchema = new mongoose.Schema({
    ref: String,
    username: String,
    messages: {
        msg: {
            ref: String,
            content: String
        }
    }
})



const Msg = mongoose.model('msg', msgSchema);
module.exports = Msg;