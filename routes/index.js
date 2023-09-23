const express = require('express')
const Routes = express.Router()
const VERSION = 'v1'

Routes.use(`/api/${VERSION}/users`, require('./usersRoutes'))
Routes.use(`/api/${VERSION}/verse-of-the-day`, require('./verseDayRoutes'))
Routes.use(`/api/${VERSION}/songs`, require('./songRoutes'))
Routes.use(`/api/${VERSION}/songs-categories`, require('./songCategoryRoutes'))
Routes.use(`/api/${VERSION}/favorites-songs`, require('./favoriteSongRoutes'))
Routes.use(`/api/${VERSION}/bible`, require('./bibleRoutes'))
Routes.use(`/api/${VERSION}/devotions`, require('./devotionRoutes'))

// Routes.use(`/api/${VERSION}/books`, require('./bookRoutes'));
// Routes.use(`/api/${VERSION}/favorites-verses`, require('./favouriteVersesRoute'));

// bibles
// Routes.get(`/api/${VERSION}/bible/versesChapterOfBook/:bookNumber/:chapter`, versesChapterOfBook);
// Routes.get(`/api/${VERSION}/bible/searchByWroksSentences/`, searchByWordsSentences);
// Routes.get(`/api/${VERSION}/bible/searchByBookChapter_Verse`, searchByBookChapter_Verse);

// devotions

module.exports = Routes
