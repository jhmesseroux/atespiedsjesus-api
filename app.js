const express = require('express')
const path = require('path')
const helmet = require('helmet')
const cors = require('cors')
const AppError = require('./helpers/AppError')
const globalErrorHandler = require('./controllers/errorController')
const morgan = require('morgan')

const app = express()
app.use(cors())
app.use(helmet())
app.set('view engine', 'pug')
app.set('views', path.join(__dirname, '/views'))
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json({ limit: '3MB' }))
app.use(express.urlencoded({ extended: true, limit: '3MB' }))

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))

  // require('./schemas/user')
  // require('./schemas/devotion')
  // require('./schemas/songCategory')
  // require('./schemas/song')
  // require('./schemas/favouriteSong')
  // require('./schemas/favouriteVerse')
  // require('./schemas/verseOfTheDay')

  // const { dbConnect } = require('./db/index')
  // dbConnect
  //   .sync({ alter: true })
  //   .then((res) => console.log('DATABASE UPDATED!!!!'))
  //   .catch((err) => console.log(err))
}

app.use(require('./routes/index'))

app.all('*', (req, res, next) => next(new AppError(`Can´t find the url ${req.originalUrl} for this server...`, 400)))
app.use(globalErrorHandler)

module.exports = app
