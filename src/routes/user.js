const express = require('express')
const router = express.Router()
const UserController = require('../app/controller/UserController')
const CheckController = require('../app/middlewares/checkout')
//render login
router.get('/login', UserController.index)

//render register
router.get('/register', CheckController.checkout, UserController.renderRegister)
// post register
router.post('/register', CheckController.checkout, UserController.register)

//post login
router.post('/', UserController.login)

// render form change passwword
router.get('/changepass', CheckController.checkout, UserController.renderchangepass)
// change password
router.post('/changepass', CheckController.checkout, UserController.changepass)

// render form forgetpass
router.get('/forgot', UserController.showforgot)


// check email 
router.post('/forgot', UserController.forgot)

// form resetpass
router.get('/reset', UserController.showReset)

// post reset pass

router.post('/reset', UserController.resetPass)

//log out
router.get('/logout', (req, res) => {
    res.clearCookie('tk')
    res.redirect('/user/login')
})
module.exports = router