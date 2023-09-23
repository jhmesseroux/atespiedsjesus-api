const factory = require('./factoryController')
const FavouriteSong = require('../schemas/favouriteSong')
const Song = require('../schemas/song')
const SongCategory = require('../schemas/songCategory')

exports.GetAll = factory.all(FavouriteSong, { include: [{ model: Song, include: [{ model: SongCategory, attributes: ['name'] }] }] })
exports.Create = factory.create(FavouriteSong, ['UserId', 'SongId'])
exports.findOne = factory.findOne(FavouriteSong)
exports.Destroy = factory.destroy(FavouriteSong)
