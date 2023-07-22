const multer = require("multer")
const cloudinary = require("cloudinary").v2
const { CloudinaryStorage } = require("multer-storage-cloudinary")
const { nanoid } = require("nanoid")

const { imageFileLimit } = require("../constants")
const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } =
  process.env

/**
 * Файли будуть завантажені одразу після отримання мультером
 */

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
})

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    if (file.fieldname !== "avatar") {
      return null
    }

    return {
      folder: "avatars",
      allowed_formats: ["jpg", "png"],
      public_id: nanoid(),
      transformation: [
        { width: 350, height: 350 },
        { width: 700, height: 700 },
      ],
    }
  },
})

const uploadFile = multer({
  storage,
  limits: {
    fileSize: imageFileLimit,
  },
})

module.exports = uploadFile
