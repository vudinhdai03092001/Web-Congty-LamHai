const Baiviet = require('../models/baiviet')
class AdminController {
    index(req, res, next) {
        Promise.all([Baiviet.find({ category: { $regex: 'dịch vụ', $options: 'i' } }).countDocuments(),
        Baiviet.find({ category: { $regex: 'tin tức', $options: 'i' } }).countDocuments(),])

            .then(([dichvu, tintuc]) => { res.render('admin/manager', { dichvu, tintuc }) })
            .catch(next)
    }
}
module.exports = new AdminController