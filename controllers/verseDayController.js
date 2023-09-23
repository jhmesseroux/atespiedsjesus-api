const factory = require('./factoryController')
const VerseDay = require('./../schemas/verseOfTheDay')
const catchAsync = require('../helpers/catchAsync')
const { connect } = require('../db')
const AppError = require('../helpers/AppError')

exports.GetAll = factory.all(VerseDay)
exports.Paginate = factory.paginate(VerseDay)
exports.Create = factory.create(VerseDay, ['bookName', 'verses', 'chapter', 'texts', 'bookNumber', 'version'])
exports.FindOne = factory.findOne(VerseDay)
exports.Destroy = factory.destroy(VerseDay)

exports.getVerseOfTheDay = catchAsync(async (req, res, next) => {
  console.log('wass')
  const votd = await VerseDay.findOne({ order: [['id', 'DESC']] })
  return res.json({
    ok: true,
    code: 200,
    status: 'success',
    data: votd,
    isThat: 'yes'
  })
})
exports.getVerseOfTheDayPause = catchAsync(async (req, res, next) => {
  const lan = req.lan
  const book = [10, 20, 30, 40, 50, 60][Math.round(Math.random() * 5)]
  const chapter = Math.floor(Math.random() * (10 - 1) + 1)
  const verse = Math.floor(Math.random() * (5 - 1) + 1)
  console.log(book, chapter, verse)
  const query = `SELECT *  FROM 
  verses v inner join books b on b.book_number = v.book_number 
  where v.book_number = ${book} and v.chapter = ${chapter} and v.verse = ${verse}`
  connect(lan.file).get(query, async (err, row) => {
    if (err) return next(new AppError(err.message, 500))

    console.log(row)
    await VerseDay.create({
      ...row,
      bookName: row.long_name,
      bookNumber: row.book_number,
      version: lan
    })
    return res.json({
      ok: true,
      code: 200,
      status: 'success',
      data: {
        version: lan,
        verse: row
      }
    })
  })
})
