const AppError = require('../helpers/AppError')
const catchAsync = require('../helpers/catchAsync')
const User = require('./../schemas/user')
const factory = require('./factoryController')
const FavouriteVerse = require('../schemas/favouriteVerse')
const { uploadPhoto } = require('../helpers/cloudinary')
const { default: slugify } = require('slugify')

exports.getUser = factory.findOne(User, { include: [{ model: FavouriteVerse }] })
exports.getAllUsers = factory.all(User)
exports.updateUser = factory.update(User, ['username', 'email', 'photo', 'active', 'role'])
exports.deleteUser = factory.destroy(User)

const filterObj = (obj, ...allowedFields) => {
  const newObj = {}
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el]
  })
  return newObj
}

exports.GetMe = (req, res, next) => {
  req.params.id = req.user.id
  next()
}
exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) { return next(new AppError('This route is not for password update. Please use /updateMyPassword', 400)) }

  const filterBody = filterObj(req.body, 'username', 'email', 'photo')
  const updatedUser = await User.update(filterBody, { where: { id: req.user.id } })

  res.status(200).json({
    status: 'success',
    ok: true,
    code: 200,
    data: updatedUser
  })
})

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.update({ active: false }, { where: { id: req.user.id } })

  res.status(200).json({
    status: 'success',
    ok: true,
    code: 200,
    data: null
  })
})

exports.uploadUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.body.photo) return next(new AppError('Please provide a photo', 400))
  const user = await User.findByPk(req.user.id)
  if (!user) return next(new AppError('The user does no longer exist', 401))
  console.log('entro.....')
  const resp = await uploadPhoto(req.body.photo, 'ATESPIEDSJESUS/USERS', slugify(user.username, { lower: true }) + '_' + user.id + '_' + user.role)
  console.log('RES CLOUNDINAY :: ', resp)
  if (resp.error) return next(new AppError(resp.error.message, 400))
  user.photo = resp.secure_url
  await user.save()
  return res.status(200).json({ ok: true, code: 200, status: 'success', data: { photo: resp.secure_url } })
})
