const { render } = require('node-sass')
const BaiViet = require('../models/baiviet')
class HomeController {
    index(req, res, next) {
        Promise.all([
            BaiViet.find({ category: { $regex: 'dịch vụ', $options: 'i' } }).lean(),
            BaiViet.find({ category: { $regex: 'tin tức', $options: 'i' } }).lean().sort({ createdAt: -1 }).limit(2),
        ])
            .then(([dichvu,tintuc]) => {
                res.render('home', { dichvu,tintuc })
            })
            .catch(next)
    }
    lienhe(req, res, next) {
        Promise.all([
            BaiViet.find({ category: { $regex: 'dịch vụ', $options: 'i' } }).lean(),])
            .then(([dichvu]) => {
                res.render('lienhe/lienhe', { dichvu })
            })
            .catch(next)
    }

    baiviet(req, res, next) {
        Promise.all([
            BaiViet.findOne({ slug: req.params.slug }).lean(),
            BaiViet.find({ category: { $regex: 'dịch vụ', $options: 'i' } }).lean(),])
            .then(([baiviet, dichvu]) => {
                res.render('news/detail', { baiviet, dichvu })
            })
            .catch(next)
    }

    tintuc(req, res, next) {
        const page = parseInt(req.query.page) || 1; // Trang hiện tại
        const pageSize = 8; // Kích thước trang
        const startIndex = (page - 1) * pageSize;
        const endIndex = page * pageSize;
        Promise.all([BaiViet.find({ category: { $regex: 'tin tức', $options: 'i' } }).lean(),
        BaiViet.find({ category: { $regex: 'tin tức', $options: 'i' } }).lean().sort({ createdAt: -1 }).limit(5),
        BaiViet.find({ category: { $regex: 'dịch vụ', $options: 'i' } }).lean(),])
            .then(([data, latestPosts, dichvu]) => {
                const totalPages = Math.ceil(data.length / pageSize);
                const pages = Array.from({ length: totalPages }, (_, index) => {
                    return {
                        number: index + 1,
                        active: index + 1 === page,
                    };
                });
                const paginatedData = data.slice(startIndex, endIndex);
                paginatedData.title = 'test'
                // Chuẩn bị dữ liệu để truyền vào template
                const viewData = {
                    dichvu: dichvu,
                    latestPosts: latestPosts,
                    tintuc: paginatedData,
                    pagination: {
                        prev: page > 1 ? page - 1 : null,
                        next: endIndex < data.length ? page + 1 : null,
                        pages: pages,
                    },
                };
                // Render template và truyền dữ liệu
                res.render('news/store', viewData);
            })
            .catch(next)
    }
    timkiem(req, res, next) {
        const page = parseInt(req.query.page) || 1; // Trang hiện tại
        const pageSize = 8; // Kích thước trang
        const startIndex = (page - 1) * pageSize;
        const endIndex = page * pageSize;
        const searchTerm = req.query.search || '';
        Promise.all([BaiViet.find({ title: { $regex: searchTerm, $options: 'i' } }).lean(),
        BaiViet.find({ category: { $regex: 'tin tức', $options: 'i' } }).lean().sort({ createdAt: -1 }).limit(5),
        BaiViet.find({ category: { $regex: 'dịch vụ', $options: 'i' } }).lean(),])
            .then(([data, latestPosts, dichvu]) => {
                const totalPages = Math.ceil(data.length / pageSize);
                const pages = Array.from({ length: totalPages }, (_, index) => {
                    return {
                        number: index + 1,
                        active: index + 1 === page,
                    };
                });
                const paginatedData = data.slice(startIndex, endIndex);
                paginatedData.title = 'test'
                // Chuẩn bị dữ liệu để truyền vào template
                const viewData = {
                    dichvu: dichvu,
                    latestPosts: latestPosts,
                    data: paginatedData,
                    searchTerm,
                    pagination: {
                        prev: page > 1 ? page - 1 : null,
                        next: endIndex < data.length ? page + 1 : null,
                        pages: pages,
                    },
                };
                // Render template và truyền dữ liệu
                res.render('search/search', viewData);
            })
            .catch(next)
    }
    error404(req, res) {
        res.render('error404/error')
    }
}
module.exports = new HomeController