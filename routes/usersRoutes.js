const express = require('express')

const authController = require('./../controllers/authController')
const userController = require('./../controllers/userController')

const usersRouter = express.Router()

usersRouter.post('/signup', authController.signUp)
usersRouter.post('/signin', authController.signIn)
usersRouter.post('/forgotPassword', authController.forgotPassword)
usersRouter.patch('/resetPassword/:token', authController.resetPassword)

usersRouter.use(authController.protect)

usersRouter.post('/renewToken', authController.renewToken)
usersRouter.get('/Me', userController.GetMe, userController.getUser)
usersRouter.patch('/updateMyPassword', authController.updatePassword)
usersRouter.patch('/updateMe', authController.restrictTo('user', 'manager', 'admin'), userController.updateMe)
usersRouter.patch('/updatePhoto', authController.restrictTo('user', 'manager', 'admin'), userController.uploadUserPhoto)
usersRouter.delete('/deleteMe', authController.restrictTo('user', 'manager'), userController.deleteMe)

usersRouter.use(authController.restrictTo('admin'))

usersRouter.route('/').get(userController.getAllUsers)
usersRouter
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser)

module.exports = usersRouter
