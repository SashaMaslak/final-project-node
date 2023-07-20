const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const gravatar = require("gravatar")
const Jimp = require("jimp")
const path = require("path")
const fs = require("fs").promises
const { nanoid } = require("nanoid")
require("dotenv").config()

const { User } = require("../models/user.js")
const { ctrlWrapper, HttpError, sendEmail } = require("../helpers/index.js")

const { SECRET_KEY, BASE_URL } = process.env

const avatarsDir = path.join(__dirname, "../", "public", "avatars")

const register = async (req, res) => {
  const { email, password } = req.body
  const user = await User.findOne({ email })

  if (user) {
    throw HttpError(409, "Email already in use")
  }

  const hashPassword = await bcrypt.hash(password, 10)
  const avatarURL = gravatar.url(email)
  const verificationToken = nanoid()

  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
    avatarURL,
    verificationToken,
  })

  const verifyEmail = {
    to: email,
    subject: "Verify Email",
    html: `<a target="_blank" href="${BASE_URL}/api/auth/verify/${verificationToken}">Click verify email</a>`,
  }

  await sendEmail(verifyEmail)

  res.status(201).json({
    user: {
      name: newUser.name,
      email: newUser.email,
      subscription: newUser.subscription,
    },
  })
}

const login = async (req, res) => {
  const { email, password } = req.body
  const user = await User.findOne({ email })

  if (!user) {
    throw HttpError(401, "Email or password is wrong")
  }

  if (!user.verify) {
    throw HttpError(401, "Email not verified")
  }

  const passwordCompare = await bcrypt.compare(password, user.password)
  if (!passwordCompare) {
    throw HttpError(401, "Email or password is wrong")
  }

  const payload = {
    id: user._id,
  }

  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" })
  await User.findByIdAndUpdate(user._id, { token })
  res.json({
    token,
    user: {
      name: user.name,
      email: user.email,
      subscription: user.subscription,
    },
  })
}

const verifyEmail = async (req, res) => {
  const { verificationToken } = req.params
  const user = await User.findOne({ verificationToken })

  if (!user) {
    HttpError(404, "User not found")
  }
  if (user.verificationToken) {
    HttpError(404)
  }

  await User.findByIdAndUpdate(user._id, {
    verify: true,
    verificationToken: "",
  })
  res.status(200).json({ message: "Verification successful" })
}

const resendVerifyEmail = async (req, res) => {
  const { email } = req.body
  const user = await User.findOne({ email })

  if (!user) {
    throw HttpError(401, "User not found")
  }

  if (user.verify) {
    throw HttpError(401, "Verification has already been passed")
  }

  const verifyEmail = {
    to: email,
    subject: "Verify Email",
    html: `<a target="_blank" href="${BASE_URL}/api/auth/verify/${user.verificationToken}">Click verify email</a>`,
  }

  await sendEmail(verifyEmail)

  res.json({ message: "Verify email send success" })
}

const logout = async (req, res) => {
  const { _id } = req.user
  await User.findByIdAndUpdate(_id, { token: "" })
  res.status(204, "Logout success").json({
    message: "Logout success",
  })
}

const getCurrent = async (req, res) => {
  const { email, name } = req.user
  res.json({ email, name })
}

const updateSubscription = async (req, res) => {
  const { _id } = req.user
  const result = await User.findByIdAndUpdate(_id, req.body, {
    new: true,
  })
  if (!result) {
    throw HttpError(404, "Not found")
  }
  res.json(result)
}

const updateAvatar = async (req, res) => {
  const { _id } = req.user
  const { path: tmpUpload, originalname } = req.file

  const image = await Jimp.read(tmpUpload)
  image.resize(250, 250)
  image.write(tmpUpload)

  const filename = `${_id}_${originalname}`
  const resultUpload = path.join(avatarsDir, filename)

  await fs.rename(tmpUpload, resultUpload)
  const avatarURL = path.join("avatars", filename)

  const result = await User.findByIdAndUpdate(
    _id,
    { avatarURL },
    {
      new: true,
    }
  )

  if (!result) {
    throw HttpError(404, "Not found")
  }
  res.json({ avatarURL })
}

module.exports = {
  register: ctrlWrapper(register),
  verifyEmail: ctrlWrapper(verifyEmail),
  login: ctrlWrapper(login),
  logout: ctrlWrapper(logout),
  getCurrent: ctrlWrapper(getCurrent),
  updateSubscription: ctrlWrapper(updateSubscription),
  updateAvatar: ctrlWrapper(updateAvatar),
  resendVerifyEmail: ctrlWrapper(resendVerifyEmail),
}
