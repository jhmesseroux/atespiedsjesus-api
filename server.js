const dotenv = require('dotenv')
dotenv.config({ path: './config.env' })

process.on('uncaughtException', (err) => {
  console.log(err.name, ' | ', err.message)
  console.log('UNCAUGHT EXCEPTION!!! . SHUTTING DOWN THE APP...')
  process.exit(1)
})

const app = require('./app')
const PORT = process.env.PORT || 4000
const server = app.listen(PORT, () => { console.log(`APP RUNNING ON PORT : ${PORT} MODE :: ${process.env.NODE_ENV}`) })

process.on('unhandledRejection', (err) => {
  console.log(err.name, ' | ', err.message)
  console.log('UNHANDLED REJECTION PROBLEM . SHUTTING DOWN THE APP...')
  server.close(() => { process.exit(1) })
})
