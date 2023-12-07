const BaiViets = require('../models/baiviet')
const moment = require('moment/moment')
class BaivietController {
    index(req, res, next) {
        const page = parseInt(req.query.page) || 1; // Trang hiện tại
        const pageSize = 4; // Kích thước trang
        const startIndex = (page - 1) * pageSize;
        const endIndex = page * pageSize;
        BaiViets.find({}).lean()
            .then(data => {
                const totalPages = Math.ceil(data.length / pageSize);
                const pages = Array.from({ length: totalPages }, (_, index) => {
                    return {
                        number: index + 1,
                        active: index + 1 === page,
                        isDots: index + 1 > 5
                    };
                });
                const paginatedData = data.slice(startIndex, endIndex);
                // Chuẩn bị dữ liệu để truyền vào template
                const viewData = {

                    baiviet: paginatedData,
                    pagination: {
                        prev: page > 1 ? page - 1 : null,
                        next: endIndex < data.length ? page + 1 : null,
                        pages: pages,
                    },
                };
                // Render template và truyền dữ liệu
                res.render('admin/baiviet/store', viewData);
            })
            .catch(next)
    }
    creat(req, res, next) {
        console.log(req.body.title)
        const baiviet = new BaiViets({
            title: req.body.title,
            category: req.body.category,
            image: req.file.path,
            content: req.body.editor,
            date: moment().format('DD-MM-YYYY')
        })
        baiviet.save()
            .then(() => res.redirect('/admin/bai-viet'))
            .catch(next)
    }
    //[GET] detail content
    detail(req, res, next) {
        BaiViets.findById(req.params.id).lean()
            .then(baiviet => res.render('admin/baiviet/detail', { baiviet }))
            .catch(next)
    }
    //[DELETE] /baiviet/:id
    delete(req, res, next) {
        BaiViets.delete({ _id: req.params.id })
            .then(() => res.redirect('back'))
            .catch(next)
    }
    // [GET] Edit /:id
    edit(req, res, next) {
        BaiViets.findById(req.params.id).lean()
            .then(baiviet => res.render('admin/baiviet/edit', { baiviet }))
            .catch(next)
    }
    //[PUT] UPDATE /:id
    update(req, res, next) {
        if (req.file) {
            BaiViets.findById(req.body.id, (err, doc) => {
                if (err) {
                    console.log(err);
                } else {
                    doc.title = req.body.title,
                        doc.image = req.file.path,
                        doc.category = req.body.category,
                        doc.content = req.body.editor,
                        doc.date = moment().format('DD-MM-YYYY')
                    doc.save()
                        .then(() => res.json({ message: 'thành công' }))
                        .catch(next)
                }
            })
        }
        else if (req.body.imageurl) {
            console.log(req.body.editor)
            BaiViets.findById(req.body.id, (err, doc) => {
                if (err) {
                    console.log(err);
                } else {
                    doc.title = req.body.title,
                        doc.image = req.body.imageurl,
                        doc.category = req.body.category,
                        doc.content = req.body.editor,
                        doc.date = moment().format('DD-MM-YYYY')
                    doc.save()
                        .then(() => res.json({ message: 'thành công' }))
                        .catch(next)
                }
            })
        }

    }

    searchAdmin(req, res, next) {
        const page = parseInt(req.query.page) || 1;
        const pageSize = 4;
        const startIndex = (page - 1) * pageSize;
        const endIndex = page * pageSize;
        const searchTerm = req.query.search || '';
        BaiViets.find({
            $or: [
                { title: { $regex: searchTerm, $options: 'i' } },
                { category: { $regex: searchTerm, $options: 'i' } }
            ]
        }).lean()
            .then(data => {
                const totalPages = Math.ceil(data.length / pageSize);
                const pages = Array.from({ length: totalPages }, (_, index) => {
                    return {
                        number: index + 1,
                        active: index + 1 === page,
                        isDots: index + 1 > 5
                    };
                });
                const paginatedData = data.slice(startIndex, endIndex);
                // Chuẩn bị dữ liệu để truyền vào template
                const viewData = {
                    baiviet: paginatedData,
                    searchTerm,
                    pagination: {
                        // valuecurrent: searchTerm,
                        prev: page > 1 ? page - 1 : null,
                        next: endIndex < data.length ? page + 1 : null,
                        pages: pages,
                    },
                };
                // Render template và truyền dữ liệu
                res.render('admin/baiviet/store', viewData);
            })
    }

    //[Get] Trash
    trash(req, res, next) {
        const page = parseInt(req.query.page) || 1; // Trang hiện tại
        const pageSize = 4; // Kích thước trang
        const startIndex = (page - 1) * pageSize;
        const endIndex = page * pageSize;
        BaiViets.findWithDeleted({ deleted: true }).lean()
            .then(data => {
                const totalPages = Math.ceil(data.length / pageSize);
                const pages = Array.from({ length: totalPages }, (_, index) => {
                    return {
                        number: index + 1,
                        active: index + 1 === page,
                        isDots: index + 1 > 5
                    };
                });
                const paginatedData = data.slice(startIndex, endIndex);
                // Chuẩn bị dữ liệu để truyền vào template
                const viewData = {

                    baiviet: paginatedData,
                    pagination: {
                        prev: page > 1 ? page - 1 : null,
                        next: endIndex < data.length ? page + 1 : null,
                        pages: pages,
                    },
                };
                // Render template và truyền dữ liệu
                res.render('admin/baiviet/trash', viewData);
            })
    }
    //[PATCH]
    restore(req, res, next) {
        BaiViets.restore({ _id: req.params.id })
            .then(() => res.redirect('back'))
            .catch(next)
    }
    //[DELETE] /baiviet/:id/force
    forceDestroy(req, res, next) {
        BaiViets.deleteOne({ _id: req.params.id })
            .then(() => res.redirect('back'))
            .catch(next)
    }

    // handle form action 
    handleFormAction(req, res, next) {

        switch (req.body.action) {
            case 'delete':
                BaiViets.delete({ _id: { $in: req.body.baivietIds } })
                    .then(() => res.redirect('back'))
                    .catch(next)
                break;
            default:
                res.json({ message: 'action is invalid' })
        }

    }
    handleFormActionTrash(req, res, next) {
        switch (req.body.action) {
            case 'delete':
                BaiViets.deleteMany({ _id: { $in: req.body.baivietIds } })
                    .then(() => res.redirect('back'))
                    .catch(next)
                break;

            case 'restore':
                BaiViets.restore({ _id: { $in: req.body.baivietIds } })
                    .then(() => res.redirect('back'))
                    .catch(next)
                break;
            default:
                res.json({ message: 'action is invalid' })
        }
    }
}
module.exports = new BaivietController