const express = require('express')
const router = express.Router()
const AdminController = require('../app/controller/AdminController')
const CheckController = require('../app/middlewares/checkout')
router.use('/', CheckController.checkout, AdminController.index)
module.exports = router