const cloudinary = require('cloudinary').v2
cloudinary.config({
  cloud_name: 'draxircbk',
  api_key: '416875141135778',
  api_secret: 'ZJOJeLBR_75qTwdmxBcAcGO6w3I'
})

const uploadPhoto = async (file, folder, publicId = undefined, format = 'png') => {
  try {
    const res = await cloudinary.uploader.upload(file, {
      folder,
      use_filename: true,
      format,
      unique_filename: true,
      overwrite: true,
      public_id: publicId
    })
    return res
  } catch (error) {
    return error
  }
}

module.exports = { cloudinary, uploadPhoto }
