const jwt = require('jsonwebtoken')
const db = require('./db')

var currentId
var currentUser

const register = (userName, userId, password) => {
    return db.User.findOne({ userId })
        .then(user => {
            if (user) {
                return {
                    statusCode: 401,
                    status: false,
                    message: 'Account already exists'
                }
            }
            else {
                const newUser = new db.User({
                    userId,
                    userName,
                    password,
                    events: []
                })
                newUser.save()
                return {
                    statusCode: 200,
                    status: true,
                    message: 'Successfully registered'
                }
            }
        })
}
const login = (userId, password) => {
    return db.User.findOne({ userId })
        .then(user => {
            if (user) {
                if (user.password == password) {
                    currentUser = user.userName
                    currentId = userId
                    // generate token 
                    const token = jwt.sign({
                        currentId: userId
                    }, 'secretkey123')
                    return {
                        statusCode: 200,
                        status: true,
                        message: 'Login Successful',
                        token,
                        currentId,
                        currentUser
                    }
                } else {
                    return {
                        statusCode: 401,
                        status: false,
                        message: 'Invalid credentials'
                    }
                }
            }
            else {
                return {
                    statusCode: 401,
                    status: false,
                    message: 'Invalid credentials'
                }
            }

        })
}
const deleteUser = (userId) => {
    return db.User.deleteOne({ userId })
        .then(user => {
            if (!user) {
                return {
                    statusCode: 422,
                    status: false,
                    message: 'User not found'
                }
            }
            else {
                return {
                    statusCode: 200,
                    status: true,
                    message: 'user deleted successfully'
                }
            }
        })
}
const addEvent = (userId, eventDate, eventDescription) => {
    return db.User.findOne({ userId })
        .then(user => {
            if (user) {
                user.events.push({
                    date: eventDate,
                    description: eventDescription
                })
                user.save()
                return {
                    statusCode: 200,
                    status: true,
                    message: eventDate + ':' + eventDescription + ' Added'
                }
            }
            else {
                return {
                    statusCode: 422,
                    status: false,
                    message: 'Invalid Credentials'
                }
            }
        })
}
const editEvent = (userId, oldDate, oldDescription, newDate, newDescription) => {
    return db.User.updateOne({
        'userId': userId, "events.date": oldDate, "events.description": oldDescription
    },
        {
            $set: {
                "events.$.date": newDate,
                "events.$.description": newDescription
            }
        })
        .then(user => {
            if (user) {
                return {
                    statusCode: 200,
                    status: true,
                    message: "Event updated"
                }
            }
            else {
                return {
                    statusCode: 422,
                    status: false,
                    message: 'No data found'
                }
            }
        })
}
const findEvent = (myId) => {
    return db.User.findOne({ userId: myId })
        .then(user => {
            if (user) {
                return {
                    statusCode: 200,
                    status: true,
                    message: user.events
                }
            }
            else {
                return {
                    statusCode: 422,
                    status: false,
                    message: 'No data found'
                }
            }

        })
}
const eventList = (userId) => {
    return db.User.findOne({ userId })
        .then(user => {
            if (user) {
                return {
                    statusCode: 200,
                    status: true,
                    message: user.events
                }
            }
            else {
                return {
                    statusCode: 422,
                    status: false,
                    message: 'User not found'
                }
            }
        })
}
const removeItem = (myId, mydate, mydesc) => {
    return db.User.updateOne({ 'userId': myId }, { $pull: { events: { date: mydate }, events: { description: mydesc } } })
        .then(user => {
            if (!user) {
                return {
                    statusCode: 422,
                    status: false,
                    message: 'User not found'
                }
            }
            else {
                return {
                    statusCode: 200,
                    status: true,
                    message: mydesc + ' event on ' + mydate + ' is deleted'
                }
            }
        })
}
module.exports = {
    register,
    login,
    deleteUser,
    addEvent,
    editEvent,
    eventList,
    removeItem,
    findEvent
}