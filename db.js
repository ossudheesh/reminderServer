const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/reminderServer', {
    useNewUrlParser: true
})
const User = mongoose.model('User', {
    userId: Number,
    userName: String,
    password: Number,
    events: []
})
module.exports={
    User
}