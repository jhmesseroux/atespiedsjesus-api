const { DataTypes } = require('sequelize')
const { dbConnect } = require('./../db/index')
const VerseDay = dbConnect.define(
  'VerseDay',
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
    version: {
      type: DataTypes.JSON,
      allowNull: false
    },
    bookName: {
      type: DataTypes.STRING(70),
      allowNull: false
    },
    bookNumber: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    chapter: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    verses: {
      type: DataTypes.STRING(7),
      allowNull: false
    },
    texts: {
      type: DataTypes.JSON,
      allowNull: false
      // get () {
      //   const texts = this.getDataValue('texts')
      //   return JSON.parse(texts)
      // }
    }
  },
  {
    tableName: 'verseofthedays',
    modelName: 'VerseDay',
    timestamps: true
  }
)

module.exports = VerseDay
