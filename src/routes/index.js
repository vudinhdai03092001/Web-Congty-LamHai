const homeRouter = require('./home')
const adminRouter = require('./admin')
const baivietRouter = require('./baiviet')
const userRouter = require('./user')
function route(app) {

    app.use('/admin/bai-viet', baivietRouter)
    app.use('/admin', adminRouter)
    app.use('/user', userRouter)
    app.use('/', homeRouter)

 }
 module.exports = route