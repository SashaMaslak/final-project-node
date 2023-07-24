const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const gravatar = require("gravatar")
const path = require("path")
const { nanoid } = require("nanoid")
require("dotenv").config()

const { User } = require("../models/user.js")
const { ctrlWrapper, HttpError, sendEmail } = require("../helpers/index.js")

const { SECRET_KEY, BASE_URL_FRONTEND } = process.env

const register = async (req, res) => {
  const { email, password } = req.body
  const user = await User.findOne({ email })
  if (user) {
    throw HttpError(409, "Email already in use")
  }
  const hashPassword = await bcrypt.hash(password, 10)
  const avatar = gravatar.url(email)
  const verificationToken = nanoid()
  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
    avatar,
    verificationToken,
    verify: false,
  })
  const verifyEmail = {
    to: email,
    subject: "Verify Email",
    html: `<a target="_blank" href="${BASE_URL_FRONTEND}/afterverify/${verificationToken}">HELLO my friend, Click for verify your email</a>`,
  }
  await sendEmail(verifyEmail)
  res.status(201).json({
    user: {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      city: newUser.city,
      phone: newUser.phone,
      favorites: newUser.favorites,
      ownPets: newUser.ownPets,
      avatar: newUser.avatar,
    },
  })
}

const login = async (req, res) => {
  const { email, password } = req.body
  const user = await User.findOne({ email })
  if (!user) {
    throw HttpError(401, "Email or password is wrong")
  } else if (!user.verify) {
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
      id: user._id,
      name: user.name,
      email: user.email,
      city: user.city,
      phone: user.phone,
      favorites: user.favorites,
      ownPets: user.ownPets,
      avatar: user.avatar,
    },
  })
}

const verifyEmail = async (req, res) => {
  const { verificationToken } = req.params
  const user = await User.findOne({ verificationToken })
  if (!user) {
    HttpError(404, "User not found")
  } else if (!user.verificationToken) {
    HttpError(404)
  }
  await User.findByIdAndUpdate(user._id, {
    verify: true,
    verificationToken: "",
  })
  const payload = { id: user._id }
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" })
  res.json({ token })
}

const resendVerifyEmail = async (req, res) => {
  const { email } = req.body
  const user = await User.findOne({ email })
  if (!user) {
    throw HttpError(404, "User not found")
  } else if (user.verify) {
    throw HttpError(401, "Verification has already been passed")
  }
  const verifyEmail = {
    to: email,
    subject: "Verify Email",
    html: `<a target="_blank" href="${BASE_URL_FRONTEND}/afterverify/${verificationToken}">Click verify email</a>`,
  }
  await sendEmail(verifyEmail)
  res.json({ message: "Verify email send success" })
}

const logout = async (req, res) => {
  const { _id } = req.user
  await User.findByIdAndUpdate(_id, { token: "" })
  res.status(204).json({ message: "Logout success" })
}

const getCurrent = async (req, res) => {
  const { _id, email, name, city, phone, favorites, ownPets, avatar, token } =
    req.user

  const user = {
    id: _id,
    name,
    email,
    city,
    phone,
    favorites,
    ownPets,
    avatar,
  }

  res.json({ token, user })
}

const getUserIdFromToken = authorizationHeader => {
  const token = authorizationHeader.split(" ")[1]
  const decodedToken = jwt.verify(token, SECRET_KEY)
  return decodedToken.id
}

const refreshToken = async (req, res) => {
  const authorizationHeader = req.headers.authorization
  if (!authorizationHeader) {
    throw HttpError(401, "Authorization header missing")
  }
  const userId = getUserIdFromToken(authorizationHeader)
  const user = await User.findOne({ _id: userId })
  if (!user) {
    throw HttpError(401, "Invalid token")
  }
  try {
    const payload = { id: user._id }
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" })
  } catch (error) {
    if (error.message === "jwt expired") {
      throw HttpError(400, "Invalid Token")
    }
    throw HttpError(500, "Server error")
  }
  await User.findByIdAndUpdate(user._id, { token })
  res.json({
    token,
    user: {
      email: user.email,
      subscription: user.subscription,
      avatar: user.avatarURL,
      name: user.name,
      surname: user.surname,
      phone: user.phone,
      country: user.country,
    },
  })
}

const updateUser = async (req, res) => {
  const { _id } = req.user
  const user = await User.findByIdAndUpdate(_id, req.body, {
    new: true,
  })
  res.json({ user })
}

const updateAvatar = async (req, res) => {
  const { _id } = req.user
  const { path: avatar } = req.file
  const result = await User.findByIdAndUpdate(
    _id,
    { avatar },
    {
      new: true,
    }
  )
  res.json({ avatar })
}

module.exports = {
  register: ctrlWrapper(register),
  verifyEmail: ctrlWrapper(verifyEmail),
  login: ctrlWrapper(login),
  logout: ctrlWrapper(logout),
  getCurrent: ctrlWrapper(getCurrent),
  refreshToken: ctrlWrapper(refreshToken),
  updateUser: ctrlWrapper(updateUser),
  updateAvatar: ctrlWrapper(updateAvatar),
  resendVerifyEmail: ctrlWrapper(resendVerifyEmail),
}
