const AppError = require('../helpers/AppError')
const { responses } = require('../translations/responses')

const handleSequelizeValidationError = (error) => new AppError(error.errors.map((e) => e.message).join(',,'), 400)
const handleSequelizeForeignKeyConstraintError = (error) => new AppError(`There is a problem with the foreign key(s) (${error.fields?.join(',')}) in table ${error?.table}. Make sure you submit the data correctly.`, 400)
const handleSequelizeUniqueConstraintError = (error) => new AppError(error.errors.map((e) => e.message).join(',,'), 400)
const handleJsonWebTokenError = (req) => new AppError(responses.invalidToken[req.headers.language || process.env.DEFAULT_LANGUAGE], 401)
const handleJWTExpiredToken = (req) => new AppError(responses.expiredToken[req.headers.language || process.env.DEFAULT_LANGUAGE], 401)
const handleSequelizeAccessDeniedError = (req) => new AppError(responses.connectionError[req.headers.language || process.env.DEFAULT_LANGUAGE], 401)

const sendError = (err, res, req) => {
  if (process.env.NODE_ENV !== 'production') {
    return res.status(err.statusCode).json({
      ok: false,
      status: err.status,
      message: err.message.split(',,')[0],
      errors: err.message.split(',,'),
      error: { ...err, message: err.message },
      stack: err.stack
    })
  }

  if (err.isOperational) {
    return res.status(err.statusCode).json({
      ok: false,
      status: err.status,
      message: err.message.split(',,')[0],
      errors: err.message.split(',,'),
      code: err.statusCode
    })
  }

  return res.status(500).json({ ok: false, status: 'error', code: 500, message: responses.unknownError[req.headers.language || process.env.DEFAULT_LANGUAGE] })
}

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500
  err.status = err.status || 'error'

  let error = Object.assign(err)
  // console.log(error)
  if (error.name === 'SequelizeAccessDeniedError') error = handleSequelizeAccessDeniedError(req)
  if (error.name === 'JsonWebTokenError') error = handleJsonWebTokenError(req)
  if (error.name === 'TokenExpiredError') error = handleJWTExpiredToken(req)
  if (error.name === 'SequelizeValidationError') error = handleSequelizeValidationError(error)
  if (error.name === 'SequelizeUniqueConstraintError') error = handleSequelizeUniqueConstraintError(error)
  if (error.name === 'SequelizeForeignKeyConstraintError') error = handleSequelizeForeignKeyConstraintError(error)

  sendError(error, res, req)
}
