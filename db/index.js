const sqlite3 = require('sqlite3').verbose()
const { Sequelize } = require('sequelize')

exports.connect = (file) => new sqlite3.Database(`./db/${file}`)

exports.dbConnect = new Sequelize({
  host: process.env.DB_HOST,
  dialect: 'mysql',
  logging: process.env.NODE_ENV === 'development',
  database: process.env.DB_NAME,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  define: {
    timestamps: false,
    charset: 'utf8mb4',
    collate: 'utf8mb4_unicode_ci'
  }
  // storage: './db/atespiedsjesus.SQLite3'
})
