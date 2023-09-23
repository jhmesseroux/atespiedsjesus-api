const AppError = require('../helpers/AppError')
const catchAsync = require('../helpers/catchAsync')
const { songsCategories } = require('../helpers/data')
const Song = require('../schemas/song')
const SongCategory = require('../schemas/songCategory')
const User = require('../schemas/user')
const { songs } = require('../helpers/chantDesperans')
const factory = require('./factoryController')
const slugify = require('slugify')

const songsBook = songs.map((s) => ({
  SongCategoryId: songsCategories.find((b) => b.name === s.book.name).id,
  views: 0,
  likes: 0,
  title: s.title,
  lyrics: s.lyrics,
  num: s.num,
  videos: null,
  language: s.language,
  songId: s.songId,
  lyricsHtml: s.lyrics_Markdown.html,
  slug: slugify(s.title)
}))

exports.GetAll = factory.all(Song, { include: [{ model: SongCategory }] })
exports.paginate = factory.paginate(Song, { include: [{ model: SongCategory }] })
exports.Create = factory.create(Song, ['title', 'num', 'video', 'lyrics', 'songId', 'lyricsHtml', 'language', 'likes', 'views', 'slug', 'SongCategoryId'])
exports.update = factory.update(Song, ['video', 'lyrics', 'lyricsHtml'])
exports.FindByPk = factory.findByPk(Song, { include: [{ model: User }] }) // TODO :  use the user info to validate if the user has already liked the song or has it as favorite
exports.bulk = factory.bulk(Song, songsBook)

exports.addLikes = catchAsync(async (req, res, next) => {
  const doc = await Song.findByPk(req.params.id)
  if (!doc) return next(new AppError('No document with that ID ', 404))
  const newDoc = await Song.update({ likes: doc.likes + 1 }, { where: { id: req.params.id } })

  return res.status(200).json({
    ok: true,
    status: 'success',
    code: 200,
    data: newDoc
  })
})

exports.addViews = catchAsync(async (req, res, next) => {
  const doc = await Song.findByPk(req.params.id)
  if (!doc) return next(new AppError('No document with that ID ', 404))
  const newDoc = await Song.update({ views: doc.views + 1 }, { where: { id: req.params.id } })

  return res.status(200).json({
    status: 'success',
    ok: true,
    code: 200,
    data: newDoc
  })
})
