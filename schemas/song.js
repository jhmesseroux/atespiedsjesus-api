const { DataTypes } = require('sequelize')
const { dbConnect } = require('./../db/index')
const Song = dbConnect.define(
  'Song',
  {
    id: {
      primaryKey: true,
      allowNull: false,
      type: DataTypes.BIGINT,
      autoIncrement: true
    },
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    views: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    likes: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    title: {
      allowNull: false,
      type: DataTypes.STRING
    },
    num: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    songId: {
      allowNull: false,
      type: DataTypes.STRING
    },
    lyrics: {
      allowNull: false,
      type: DataTypes.TEXT('medium')
    },
    lyricsHtml: {
      allowNull: false,
      type: DataTypes.TEXT('medium')
    },
    slug: {
      allowNull: false,
      type: DataTypes.STRING
    },
    video: {
      type: DataTypes.STRING
    },
    language: {
      type: DataTypes.STRING(2),
      allowNull: false
    },
    SongCategoryId: {
      type: DataTypes.BIGINT,
      allowNull: false
    }
  },
  {
    tableName: 'songs',
    modelName: 'Song',
    timestamps: true
  }
)
// SongCategory.hasMany(Song)
// Song.belongsTo(SongCategory)
module.exports = Song
