const express = require('express')
const dataService = require('./dataService')
const jwt = require('jsonwebtoken')
const cors = require('cors')

const app = express()
app.use(express.json())

app.use(cors({
    origin: 'http://localhost:4200'
}))
const jwtMiddleware = (req, res, next) => {
    try {
        const token = req.headers["x-access-token"]
        const data = jwt.verify(token, 'secretkey123')
        req.currentAccNo = data.currentAccNo
        next()
    } catch {
        res.status(401).json({
            status: false,
            message: "Please Login"
        })
    }
}
const logMiddleware = (req, res, next) => {
    next()
}
app.use(logMiddleware)


app.post('/register', (req, res) => {
    dataService.register(req.body.userName, req.body.userId, req.body.password)
        .then(result => {
            res.status(result.statusCode).json(result)
        })
})
app.post('/login', (req, res) => {
    dataService.login(req.body.userId, req.body.password)
        .then(result => {
            res.status(result.statusCode).json(result)
        })
})
app.delete('/onDelete/:userId', jwtMiddleware, (req, res) => {
    dataService.deleteUser(req.params.userId)
        .then(result => {
            res.status(result.statusCode).json(result)
        })
})
app.post('/addEvent', jwtMiddleware, (req, res) => {
    dataService.addEvent(req.body.userId, req.body.eventDate, req.body.eventDescription)
        .then(result => {
            res.status(result.statusCode).json(result)
        })
})
app.post('/editEvent', jwtMiddleware, (req, res) => {
    dataService.editEvent(req.body.userId,req.body.oldDate, req.body.oldDescription,req.body.newDate, req.body.newDescription)
        .then(result => {
            res.status(result.statusCode).json(result)
        })
})
app.post('/findEvent', jwtMiddleware, (req, res) => {
    dataService.findEvent(req.body.userId)
        .then(result => {
            res.status(result.statusCode).json(result)
        })
})
app.post('/eventList', jwtMiddleware, (req, res) => {
    dataService.eventList(req.body.userId)
        .then(result => {
            res.status(result.statusCode).json(result)
        })
})
app.post('/removeItem', jwtMiddleware, (req, res) => {
    dataService.removeItem(req.body.userId, req.body.date, req.body.description)
        .then(result => {
            res.status(result.statusCode).json(result)
        })
})


app.listen(3000, () => {
    console.log('server started at 3000');
})