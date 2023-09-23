const { connect } = require('../db')
const factory = require('./factoryController')
const Devotion = require('../schemas/devotion')
const AppError = require('../helpers/AppError')

exports.bulk = (req, res, next) => {
  connect('devotions/fr.SQLite3').all(
    `
  SELECT * FROM devotions
  `,
    async (err, rows) => {
      if (err) return next(new AppError(err.message, 500))
      await Devotion.bulkCreate(rows)
      //   factory.bulk(Devotion, rows)
      return res.json({ ok: true, results: rows.length, code: 200, books: rows })
    }
  )
}

exports.GetAll = factory.all(Devotion)
exports.Paginate = factory.paginate(Devotion)
exports.Create = factory.create(Devotion, ['day', 'devotion'])
exports.FindOne = factory.findOne(Devotion)
exports.Destroy = factory.destroy(Devotion)
