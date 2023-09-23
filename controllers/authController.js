const crypto = require('crypto')
const { promisify } = require('util')
const catchAsync = require('../helpers/catchAsync')
const User = require('./../schemas/user')
const jwt = require('jsonwebtoken')
const AppError = require('../helpers/AppError')
const Email = require('../helpers/email')
const { Op } = require('sequelize')
const { responses } = require('../translations/responses')
const { gl } = require('../helpers')

const createToken = (id) => {
  return jwt.sign({ id }, process.env.SECRET_TOKEN_ATPJ, {
    expiresIn: process.env.SECRET_TOKEN_ATPJ_INSPIRE_IN
  })
}

const createSendToken = async (user, statusCode, res) => {
  const token = createToken(user.id)
  user.password = undefined
  return res.status(statusCode).json({
    status: 'success',
    ok: true,
    code: 200,
    token,
    data: user
  })
}

exports.signUp = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body)
  createSendToken(newUser, 201, res)
})

exports.signIn = catchAsync(async (req, res, next) => {
  const { email, password } = req.body

  if (!email || !password) return next(new AppError(gl(req, 'provideEmailAndPassword'), 400))

  const user = await User.findOne({ where: { email } })

  if (!user || !(await user.checkPassword(password, user.password))) { return next(new AppError(gl(req, 'incorrectEmailOrPassword'), 401)) }

  createSendToken(user, 200, res)
})

exports.protect = catchAsync(async (req, res, next) => {
  console.log('token :: ', req.headers.authorization)
  let token
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) token = req.headers.authorization.split(' ')[1]
  if (!token) return next(new AppError(responses.notLogged[req.headers.language || process.env.DEFAULT_LANGUAGE], 401))

  const decoded = await promisify(jwt.verify)(token, process.env.SECRET_TOKEN_ATPJ)
  const currentUser = await User.findByPk(decoded.id)

  if (!currentUser) return next(new AppError('The user does no longer exist', 401))

  if (currentUser.changePasswordAfter(decoded.iat)) return next(new AppError(gl(req, 'userChangedPasswordAfter'), 401))

  req.user = currentUser
  next()
})

exports.renewToken = catchAsync(async (req, res, next) => { createSendToken(req.user, 200, res) })

exports.fakeProtect = catchAsync(async (req, res, next) => {
  let token
  if (req.headers.xczmbvyawe && req.headers.xczmbvyawe.startsWith('Bearer')) token = req.headers.xczmbvyawe.split(' ')[1]
  if (!token) return next(new AppError(gl(req, 'noAccessToThisServer'), 401))
  if (token !== process.env.TOKEN_TO_SECURE_CHANTS_BIBLE_RESQUEST) return next(new AppError('Invalid token !', 401))
  next()
})

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) return next(new AppError(responses.cannotPerformRole[req.headers.language || process.env.DEFAULT_LANGUAGE], 403))
    next()
  }
}

exports.forgotPassword = catchAsync(async (req, res, next) => {
  if (!req.body.email) return next(new AppError('The mail is required !', 404))

  const user = await User.findOne({ where: { email: req.body.email } })
  if (!user) return next(new AppError('This is no user with this email ..', 404))

  const resetToken = user.createPasswordResetToken()
  await user.save()

  try {
    const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`
    await new Email(user, resetURL).sendPasswordReset()
    return res.status(200).json({
      status: 'success',
      message: 'Token sent successfully!'
    })
  } catch (err) {
    user.passwordResetToken = undefined
    user.passwordResetExpires = undefined
    await user.save()
    return next(new AppError('There was a problem sending the email ', 500))
  }
})

exports.resetPassword = catchAsync(async (req, res, next) => {
  if (!req.params.token) return next(new AppError('Token invalid or expired !', 404))
  const hashToken = crypto.createHash('sha256').update(req.params.token).digest('hex')
  const user = await User.findOne({ where: { passwordResetToken: hashToken, passwordResetExpires: { [Op.gt]: Date.now() } } })
  if (!user) return next(new AppError('This is no user for this token. Token invalid or expired ..', 404))

  user.password = await user.hashPassword(req.body.password)
  user.passwordResetToken = null
  user.passwordResetExpires = null
  await user.save()
  createSendToken(user, 200, res)
})

exports.updatePassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ where: { email: req.user.email } })
  if (!user || !(await user.checkPassword(req.body.currentPassword, user.password))) return next(new AppError('Wrong password', 401))
  user.password = await user.hashPassword(req.body.password)
  await user.save()
  createSendToken(user, 200, res)
})
