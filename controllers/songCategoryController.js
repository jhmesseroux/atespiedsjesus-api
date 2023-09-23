const { songsCategories } = require('../helpers/data')
const SongCategory = require('../schemas/songCategory')
const factory = require('./factoryController')

exports.GetAll = factory.all(SongCategory)
exports.Create = factory.create(SongCategory, ['name', 'abbreviation', 'slug'])
exports.FindOne = factory.findOne(SongCategory)
exports.Bulk = factory.bulk(SongCategory, songsCategories)
