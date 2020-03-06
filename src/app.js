const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()
const config = require('./config')
const userRouter = require('./routes/userRouter')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(cors())

app.use('/api', userRouter)

const PORT = config.PORT

module.exports = {
    app, 
    PORT
}

