const express = require('express')
const authController = require('../controllers/authController')
const devotionController = require('../controllers/devotionController')

const router = express.Router()

router.post('/bulk', devotionController.bulk)
router
  .route('/')
  .get(devotionController.GetAll)
  .post(authController.protect, authController.restrictTo('admin', 'manager'), devotionController.Create)

router
  .route('/:id')
  .get(devotionController.FindOne)
  .delete(authController.protect, authController.restrictTo('admin', 'manager'), devotionController.Destroy)

module.exports = router
