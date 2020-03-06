'use strict'
const express = require('express')
const api = express.Router()
const userController = require('../controllers/userController')
const md_auth = require('../middlewares/auth')

api.post('/signin/:admin?', userController.registerUser)
api.post('/login', userController.login)
api.get('/getUsers/:_id?', md_auth.ensureAuth, userController.getUsers)
api.put('/updateUsers/:_id', md_auth.ensureAuth, userController.updateUser)
api.delete('/deleteUsers:_id', md_auth.ensureAuth, userController.deleteUser)
api.put('/adminFired/:_id',md_auth.ensureAuth, userController.adminFired)

module.exports = api