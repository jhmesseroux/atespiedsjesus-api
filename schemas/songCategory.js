const { DataTypes } = require('sequelize')
const { dbConnect } = require('../db/index')
const Song = require('./song')

const SongCategory = dbConnect.define(
  'SongCategory',
  {
    id: {
      primaryKey: true,
      allowNull: false,
      type: DataTypes.BIGINT,
      autoIncrement: true
    },
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      unique: true
    },
    name: {
      type: DataTypes.STRING(35),
      allowNull: false,
      unique: true
    },
    slug: {
      type: DataTypes.STRING(35),
      allowNull: false,
      unique: true
    },
    abbreviation: {
      allowNull: false,
      unique: true,
      type: DataTypes.STRING
    }
  },
  {
    tableName: 'songcategories',
    modelName: 'SongCategory'
  }
)

SongCategory.hasMany(Song, { foreignKey: { allowNull: false }, onUpdate: 'CASCADE', onDelete: 'RESTRICT' })
Song.belongsTo(SongCategory, { foreignKey: { allowNull: false }, onUpdate: 'CASCADE', onDelete: 'RESTRICT' })
module.exports = SongCategory
