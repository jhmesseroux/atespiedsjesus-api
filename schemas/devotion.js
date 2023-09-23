const { DataTypes } = require('sequelize')
const { dbConnect } = require('../db/index')
const Devotion = dbConnect.define(
  'Devotion',
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
    day: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    devotion: {
      type: DataTypes.TEXT('long'),
      allowNull: false
    },
    photo: DataTypes.STRING
  },
  {
    tableName: 'devotions',
    modelName: 'Devotion',
    timestamps: true
  }
)

module.exports = Devotion
