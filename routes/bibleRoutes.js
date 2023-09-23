const express = require('express')
const bibleController = require('./../controllers/bibleController')
const authController = require('./../controllers/authController')

const router = express.Router()

router
  .route('/favourites')
  .post(authController.protect, authController.restrictTo('user', 'admin'), bibleController.createFavouriteVerse)
  .get(authController.protect, authController.restrictTo('user', 'admin'), bibleController.getAllFavouriteVerses)
router.delete(
  '/favourites/:id',
  authController.protect,
  authController.restrictTo('user', 'admin'),
  bibleController.destroy
)
router.patch(
  '/favourites/:id',
  authController.protect,
  authController.restrictTo('user', 'admin'),
  bibleController.editFavouriteVerse
)

router.use(authController.fakeProtect)

router.get('/versions', bibleController.allVersion)
router.get('/books', bibleController.ValidatelanguageAndVersion, bibleController.allBooks)
router.route('/books/:id').get(bibleController.ValidatelanguageAndVersion, bibleController.getOneBook)
router.get('/intro/:bookNumber', bibleController.ValidatelanguageAndVersion, bibleController.getIntro)
router.get('/lecture/:bookNumber/:chapter', bibleController.ValidatelanguageAndVersion, bibleController.lecture)
router.get('/search', bibleController.ValidatelanguageAndVersion, bibleController.searchByWordsSentences)

module.exports = router
