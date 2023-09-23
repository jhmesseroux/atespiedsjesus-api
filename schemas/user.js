const { DataTypes } = require('sequelize')
const { dbConnect } = require('./../db/index')
const Song = require('./song')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const FavouriteVerse = require('./favouriteVerse')

const User = dbConnect.define(
  'User',
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
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Please provide a username'
        },
        notNull: {
          msg: 'Please provide a username'
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        args: true,
        msg: 'Email address already in use!'
      },
      validate: {
        isEmail: {
          msg: 'Please provide a valid email'
        },
        notEmpty: {
          msg: 'Please provide an email'
        },
        notNull: {
          msg: 'Please provide an email'
        }
      }
    },
    role: {
      allowNull: false,
      type: DataTypes.STRING(10),
      defaultValue: 'user',
      validate: {
        isIn: {
          args: [['user', 'admin', 'manager']],
          msg: 'Role must be either user, admin or manager'
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Please provide a password'
        },
        notNull: {
          msg: 'Please provide a password'
        },
        len: {
          args: [6, 20],
          msg: 'Password must be between 6 and 20 characters'
        }
      }

    },
    photo: {
      type: DataTypes.STRING,
      defaultValue: 'https://res.cloudinary.com/draxircbk/image/upload/v1692242939/ATESPIEDSJESUS/USERS/default-user-avatar.png'
    },
    googleId: DataTypes.STRING,
    passwordChangedAt: DataTypes.DATE,
    passwordResetToken: DataTypes.STRING,
    passwordResetExpires: DataTypes.DATE,
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  },
  {
    tableName: 'users',
    modelName: 'User'

  }
)

User.belongsToMany(Song, { through: 'favouritesongs' })
Song.belongsToMany(User, { through: 'favouritesongs' })

User.hasMany(FavouriteVerse)
FavouriteVerse.belongsTo(User)

User.beforeCreate(async (user, options) => {
  user.password = await bcrypt.hash(user.password, 12)
})

User.prototype.checkPassword = async function (userPassword, hash) {
  return await bcrypt.compare(userPassword, hash)
}
User.prototype.hashPassword = async function (password) {
  return await bcrypt.hash(password, 12)
}

User.prototype.changePasswordAfter = function (jwtIat) {
  if (this.passwordChangedAt) {
    const changePassword = parseInt(this.passwordChangedAt.getTime() / 1000, 10)
    return jwtIat < changePassword
  }
  return false
}

User.prototype.createPasswordResetToken = function () {
  // create token
  const resetToken = crypto.randomBytes(32).toString('hex')
  // encrypt the token and save to the database
  this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex')

  // store the time plus 10 mns to the satabase
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000
  // return the token without encrypt
  return resetToken
}

module.exports = User
