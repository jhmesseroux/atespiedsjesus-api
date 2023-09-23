const express = require('express')
const authController = require('./../controllers/authController')
const favoriteSongController = require('./../controllers/favoriteSongController')

const router = express.Router()
router.use(authController.protect)
// authController.restrictTo('user'),
router.get('/find', favoriteSongController.findOne)
router.route('/').get(favoriteSongController.GetAll).post(favoriteSongController.Create)
router
  .route('/:id')
  .delete(authController.restrictTo('user', 'admin'), favoriteSongController.Destroy)

module.exports = router
