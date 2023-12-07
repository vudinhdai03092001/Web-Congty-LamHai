const Account = require('../models/account')
var jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

class UserController {
    index(req, res) {
        res.render('user/login')
    }
    login(req, res, next) {
        try {
            var username = req.body.username
            var password = req.body.password
            console.log(password)
            //tìm kiếm user theo tên
            Account.findOne({
                username,

            })
                .then(data => {
                    console.log(data)
                    //so sánh mật khẩu khi người dùng nhập vào với mật khẩu trong data
                    bcrypt.compare(password, data.password, (err, result) => {
                        if (err) {
                            console.error('Lỗi khi so sánh mật khẩu:', err);
                        } else if (result) {
                            var token = jwt.sign({ _id: data._id }, 'mk')
                            var par = jwt.verify(token, 'mk')

                            Account.findOne({ _id: par._id })
                                .then(tk => {
                                    res.json({
                                        message: 'Đăng nhập thành công',
                                        token: token,
                                        getUser: tk,
                                    })
                                })
                        } else {
                            console.log('mật khẩu sai')
                        }
                    })
                })
                .catch(err => {
                    console.log(err)
                    res.status(500).json('loi sever')
                })
        } catch (error) {
            return res.redirect('/user/login')
        }
    }
    //[get] register
    renderRegister(req, res) {
        res.render('user/register')
    }
    //[post] form register
    register(req, res, next) {

        var email = req.body.email
        var username = req.body.username
        var password = req.body.password

        Account.findOne({ $or: [{ email }, { username }] })
            .then(data => {
                if (data) {
                    res.json({ message: 'Tài khoản đã tồn tại' })
                }
                else {
                    bcrypt.hash(password, 10, (err, hash) => {
                        if (err) {
                            console.error('Lỗi khi băm mật khẩu:', err);
                        } else {
                            // Lưu mật khẩu băm vào cơ sở dữ liệu 
                            const formdata = req.body
                            formdata.role = 0;
                            formdata.password = hash;
                            const account = new Account(formdata)
                            account.save()
                                .then(() => res.json({ message: 'Đăng kí thành công' }))
                                .catch(next)
                        }
                    })
                }
            })
            .catch(next)
    }
    // [GET] render formpass
    renderchangepass(req, res) {
        res.render('user/changePassword')
    }
    //[POST] change pass
    changepass(req, res, next) {
        try {
           
            var token = req.cookies.tk
            var id = jwt.verify(token, 'mk')
            
            Account.findOne({ _id: id }).lean()
                .then(data => {
                    var curenpasss = req.body.currentpassword
                    console.log(curenpasss)
                    //so sánh mật khẩu nhập vào với mật khẩu lấy từ database
                    bcrypt.compare(curenpasss, data.password, (err, result) => {
                        if (err) {
                            console.error('Lỗi khi tạo mật khẩu băm:', err);
                        } else if (result) {
                            bcrypt.hash(req.body.password, 10, (err, hash) => {
                                if (err) {
                                    console.error('Lỗi khi băm mật khẩu:', err);
                                } else {
                                    // Lưu mật khẩu băm vào cơ sở dữ liệu 
                                    Account.updateOne({ _id: id }, {
                                        password: hash
                                    })
                                        .then(() => { return res.json({ message: "Thay đổi mật khẩu thành công " }) })
                                        .catch(next)
                                }
                            });
                        }
                        else {
                            return res.json({ message: "Mật khẩu hiện tại không đúng" })

                        }
                    })
                })
        } catch (error) {
            console.log(error)
        }
    }

    // [get] forget PASSWORD
    showforgot(req, res) {
        res.render('user/forgotPassword')
    }
    // [post ] email when forget password
    forgot(req, res, next) {
        let email = req.body.email
        Account.findOne({ email: email })
            .then(data => {
                if (data) {
                    const { sign } = require('../middlewares/Jwt');
                    const host = req.header('host');
                    const resetLink = `${req.protocol}://${host}/user/reset?token=${sign(email)}&email=${email}`
                    const { sendForgotPasswordMail } = require('../middlewares/Email')
                    sendForgotPasswordMail(data, host, resetLink)
                        .then((result) => {
                            console.log('email has been sent')
                            return res.render('user/forgotPassword', { done: true })
                        })
                        .catch(error => {
                            console.log(error.status)
                            return res.render('user/forgotPassword', { message: "check email " })
                        })
                }
                else {
                    return res.render('user/forgotPassword', { message: " Email không tồn tại !" })
                }
            })
            .catch(next)
    }
    // [get]  show reset password
    showReset(req, res) {
        let email = req.query.email;
        let token = req.query.token;
        let { verify } = require('../middlewares/Jwt');

        if (!token || !verify(token)) {
            return res.render('user/reset', { expired: true })
        }
        else {
            return res.render('user/reset', { email, token })
        }
    }
    resetPass(req, res, next) {
        const password = req.body.password
        const email = req.body.email
        Account.findOne({ email: email }).lean()
            .then(data => {
                if (data) {
                    bcrypt.hash(password, 10, (err, hash) => {
                        if (err) {
                            console.error('Lỗi khi băm mật khẩu:', err);
                        } else {
                            // Lưu mật khẩu băm vào cơ sở dữ liệu 
                            Account.updateOne({ email: email }, { password: hash })
                                .then((data) => {
                                    if (data) {
                                        return res.json({ message: "Thay đổi mật khẩu thành công" })
                                    }
                                })
                                .catch(next)
                        }
                    });
                }
                else {
                    return res.json({ message: "Link của bạn hết hiệu lực" })
                }

            })
    }
}
module.exports = new UserController