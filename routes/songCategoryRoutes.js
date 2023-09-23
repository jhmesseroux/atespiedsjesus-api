const express = require('express')
const songCategoryController = require('./../controllers/songCategoryController')
const authController = require('./../controllers/authController')

const router = express.Router()

router.use(authController.fakeProtect)

router.post('/bulk', songCategoryController.Bulk)
router.route('/').get(songCategoryController.GetAll).post(songCategoryController.Create)
router.route('/:id').get(songCategoryController.FindOne)

module.exports = router
