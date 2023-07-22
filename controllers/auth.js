const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const gravatar = require("gravatar")
const path = require("path")
const { nanoid } = require("nanoid")
require("dotenv").config()

const { User } = require("../models/user.js")
const { ctrlWrapper, HttpError, sendEmail } = require("../helpers/index.js")

const { SECRET_KEY, BASE_URL } = process.env

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
    verify: true,
  })

  const verifyEmail = {
    to: email,
    subject: "Verify Email",
    html: `<a target="_blank" href="${BASE_URL}/users/verify/${verificationToken}">HELLO my friend, Click for verify your email</a>`,
  }

  await sendEmail(verifyEmail)

  const payload = {
    id: newUser._id,
  }

  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" })
  await User.findByIdAndUpdate(newUser._id, { token })

  res.status(201).json(
    res.status(201).json({
      token,
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
  )
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
    html: `<a target="_blank" href="${BASE_URL}/users/verify/${user.verificationToken}">Click verify email</a>`,
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

const refreshToken = async (req, res) => {
  const authorizationHeader = req.headers.authorization

  if (!authorizationHeader) {
    return res.status(401).json({ error: "Authorization header missing" })
  }

  try {
    const userId = getUserIdFromToken(authorizationHeader)
    const user = await User.findOne({ _id: userId })
    if (!user) {
      return res.status(401).json({ error: "Invalid token" })
    }

    const payload = {
      id: user._id,
    }
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" })
    await User.findByIdAndUpdate(user._id, { token })

    return res.json({
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
  } catch (error) {
    return error.message === "jwt expired"
      ? res.status(400).json({ error: "Invalid Token" })
      : res.status(500).json({ error: "Server error" })
  }
}

const updateUser = async (req, res) => {
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
  const { path: avatar } = req.file
  const result = await User.findByIdAndUpdate(
    _id,
    { avatar },
    {
      new: true,
    }
  )

  if (!result) {
    throw HttpError(404, "Not found")
  }
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
