
const Account = require('../models/account')
var jwt = require('jsonwebtoken');
class CheckController {
    checkout(req, res, next) {
        var token = req.cookies.tk
        if (token === undefined) {
            res.render('error404/error')
        }
        else {
            var idUser = jwt.verify(token, 'mk')
            Account.find({ _id: idUser._id })
                .then(data => {

                    if (data.length === 0) {
                        res.redirect('/user/login')
                    }
                    else {
                        if (data[0].role >= 0) {
                            next()
                        }
                        else {
                            res.redirect('/user/login')
                        }
                    }
                }
                )
                .catch(() => { res.json('loi sever') })
        }
    }
}
module.exports = new CheckController
