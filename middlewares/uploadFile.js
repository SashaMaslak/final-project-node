const multer = require("multer")
const cloudinary = require("cloudinary").v2
const { CloudinaryStorage } = require("multer-storage-cloudinary")

/**
 * Файли будуть завантажені одразу після отримання мультером
 */

const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } =
  process.env

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
})

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    let folder

    switch (file.fieldname) {
      case "avatar":
        folder = "avatars"
      case "documents":
        folder = "documents"
      default:
        folder = "misc"
    }

    return {
      folder,
      allowed_formats: ["jpg", "png"],
      public_id: req.user._id,
      transformation: [
        { width: 350, height: 350 },
        { width: 700, height: 700 },
      ],
    }
  },
})

const upload = multer({
  storage,
  limits: {
    fileSize: 3 * 1024 * 1024,
  },
})
module.exports = upload
