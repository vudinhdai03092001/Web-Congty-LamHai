const express = require('express')
const router = express.Router()
const BaiVietController = require('../app/controller/BaiVietController')
const upload = require('../app/middlewares/uploadMiddle')
const CheckController = require('../app/middlewares/checkout')
router.get('/', CheckController.checkout, BaiVietController.index)
router.post('/creat', CheckController.checkout, upload.single('image'), BaiVietController.creat)

// submit checkbox store
router.post('/handle-form-actions', CheckController.checkout, BaiVietController.handleFormAction)

// submit checkbox trash
router.post('/handle-form-actions-trash', CheckController.checkout, BaiVietController.handleFormActionTrash)


//xem chi tiết content
router.get('/:id/detail', CheckController.checkout, BaiVietController.detail)
//xóa mềm
router.delete('/:id', CheckController.checkout, BaiVietController.delete)

//xóa vĩnh viễn
router.delete('/:id/force', CheckController.checkout, BaiVietController.forceDestroy)
//form edit
router.get('/:id/edit', CheckController.checkout, BaiVietController.edit)
//update
router.put('/:id', CheckController.checkout, upload.single('image'), BaiVietController.update)
// những bài viết đã xóa
router.get('/trash', CheckController.checkout, BaiVietController.trash)

// restore 
router.patch('/:id/restore', CheckController.checkout, BaiVietController.restore)

// tìm kiếm bài viết trong admin
router.get('/search-admin', CheckController.checkout, BaiVietController.searchAdmin)
module.exports = router