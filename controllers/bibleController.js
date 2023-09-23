const { connect } = require('../db')
const AppError = require('../helpers/AppError')
const catchAsync = require('../helpers/catchAsync')
const { versions } = require('../helpers/data')

const FavouriteVerse = require('../schemas/favouriteVerse')
const factory = require('./factoryController')

// include: [{ model: User }];
exports.getAllFavouriteVerses = factory.all(FavouriteVerse)
exports.createFavouriteVerse = factory.create(FavouriteVerse, ['UserId', 'uuid', 'verses', 'texts', 'chapter', 'note', 'type', 'color', 'bookName', 'bookNumber', 'version'])
exports.editFavouriteVerse = factory.update(FavouriteVerse, ['note'])
exports.destroy = factory.destroy(FavouriteVerse)

exports.ValidatelanguageAndVersion = (req, res, next) => {
  const { language, version } = req.query
  if (!language) return next(new AppError('Parameter language : required', 400))
  let lan = versions.find((v) => v.language === language)
  if (!lan) return next(new AppError('This language does not exist !', 400))
  if (version) {
    lan = versions.find((v) => v.language === language && v.name === version)
    if (!lan) return next(new AppError('We do not have this version for this language', 400))
  }
  req.lan = lan
  next()
}

exports.allVersion = (req, res, next) => {
  return res.json({
    ok: true,
    status: 'success',
    code: 200,
    results: versions.length,
    data: versions
  })
}

exports.allBooks = catchAsync(async (req, res, next) => {
  const lan = req.lan
  connect(lan.file).all(
    `SELECT books.book_number, short_name, long_name ,count(distinct chapter) as chapters, count(verse) as verses
    FROM books 
    inner JOIN verses 
    on books.book_number = verses.book_number
    GROUP by books.book_number, short_name, long_name
  `,
    (err, rows) => {
      if (err) return next(new AppError(err.message, 500))
      return res.json({
        ok: true,
        status: 'success',
        results: rows.length,
        code: 200,
        data: {
          version: lan,
          books: rows
        }
      })
    }
  )
})

exports.getOneBook = catchAsync(async (req, res, next) => {
  const lan = req.lan
  const query = `SELECT *  FROM books where book_number = ${req.params.id}`
  connect(lan.file).get(query, (err, row) => {
    if (err) return next(new AppError(err.message, 500))
    return res.json({
      ok: true,
      code: 200,
      status: 'success',
      data: {
        version: lan,
        book: row
      }
    })
  })
})

// TODO : Verify yhe versions which have intro
exports.getIntro = catchAsync(async (req, res, next) => {
  const lan = req.lan
  const query = `SELECT *  FROM introductions where book_number = ${req.params.bookNumber}`
  connect(lan.file).get(query, (err, row) => {
    if (err) return next(new AppError(err.message, 500))
    return res.json({
      ok: true,
      code: 200,
      status: 'success',
      data: {
        version: lan,
        into: row
      }
    })
  })
})

// TODOD : Verify the versions which have stories
exports.lecture = catchAsync(async (req, res, next) => {
  const lan = req.lan
  const { bookNumber, chapter } = req.params
  const query = `SELECT v.book_number,v.chapter , v.verse,v.text FROM verses v   
                 WHERE v.book_number = ${bookNumber} and v.chapter = ${chapter}
                  `
  // const query = `SELECT v.book_number,v.chapter , v.verse,v.text ,st.title,st.verse startVerseTitle FROM verses v
  //                left join stories st on v.book_number = st.book_number and v.chapter = st.chapter and v.verse = st.verse
  //                WHERE v.book_number = ${bookNumber} and v.chapter = ${chapter}
  //                 `;
  connect(lan.file).all(query, (err, rows) => {
    if (err) return next(new AppError(err.message, 500))
    // let output = rows.reduce((acc, currentValue, currentIndex, data) => {
    //   if (acc.find((d) => d.verse == currentValue.verse && d.text == currentValue.text)) {
    //     return acc.map((l) => {
    //       if (currentValue.verse === l.verse) {
    //         l.titles = [...l.titles, currentValue?.title];
    //       }
    //       return l;
    //     });
    //   } else {
    //     return [
    //       ...acc,
    //       {
    //         book_number: currentValue.book_number,
    //         chapter: currentValue.chapter,
    //         verse: currentValue.verse,
    //         text: currentValue.text,
    //         startVerseTitle: currentValue.startVerseTitle,
    //         titles: currentValue.title ? [currentValue?.title] : null,
    //       },
    //     ];
    //   }
    // }, []);
    return res.json({
      ok: true,
      results: rows.length,
      status: true,
      code: 200,
      data: {
        version: lan,
        verses: rows
      }
    })
  })
})

exports.searchByWordsSentences = catchAsync(async (req, res, next) => {
  const lan = req.lan
  const { search, limit } = req.query
  const query = `SELECT * FROM verses v WHERE v.text LIKE '%${search.toLowerCase()}%' limit ${limit}`
  connect(lan.file).all(query, (err, rows) => {
    if (err) return next(new AppError(err.message, 500))
    return res.json({
      ok: true,
      results: rows.length,
      status: 'success',
      code: 200,
      data: {
        version: lan,
        verses: rows
      }
    })
  })
})

exports.getRandomVerse = catchAsync(async (req, res, next) => {
  const lan = req.lan

  // const { bookNumber, chapter ,search } = req.params
  connect(lan.file).all(
    `
    SELECT *
    FROM verses v
    // WHERE v.text LIKE ${''} 
    `,
    (err, rows) => {
      if (err) return next(new AppError(err.message, 500))
      return res.json({ ok: true, results: rows.length, status: true, code: 200, version: lan, books: rows })
    }
  )
})

exports.searchByBookChapter_Verse = catchAsync(async (req, res) => {
  const lan = req.lan
  const { search } = req.query
  const v = search.split('.')
  // let verses
  const book = v[0]
  const chapter = v[1]
  // verses = v[2];
  // if(verses.length > 0){}
  // console.log(verses);

  // return;
  connect(lan.file).all(
    `
    SELECT *
    FROM verses v
    WHERE v.short_name = ${book} and v.chapter = ${chapter}
    `,
    (err, rows) => {
      if (err) return res.json({ ok: false, status: false, code: 401, err, message: err.message })
      return res.json({ ok: true, results: rows.length, status: true, code: 200, version: lan, verses: rows })
    }
  )
})
