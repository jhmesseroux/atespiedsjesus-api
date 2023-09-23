const { DataTypes } = require('sequelize')
const { dbConnect } = require('./../db/index')
const Song = require('./song')
const User = require('./user')
const FavouriteSong = dbConnect.define(
  'FavouriteSong',
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
    UserId: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    SongId: {
      type: DataTypes.BIGINT,
      allowNull: false
    }
  },
  {
    tableName: 'favouritesongs',
    modelName: 'FavouriteSong',
    timestamps: true
  }
)
FavouriteSong.belongsTo(Song)
FavouriteSong.belongsTo(User)
module.exports = FavouriteSong
