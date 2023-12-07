const express = require('express')
const router = express.Router()
const HomeController = require('../app/controller/HomeController')
router.use('/tin-tuc', HomeController.tintuc)
router.use('/lien-he', HomeController.lienhe)
router.get('/tim-kiem', HomeController.timkiem)
router.use('/bai-viet/:slug', HomeController.baiviet)
router.get('/error', HomeController.error404)
router.use('/', HomeController.index)

module.exports = router