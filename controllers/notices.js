const { Notice } = require("../models/notice")
const { User } = require("../models/user")
const { Types } = require("mongoose")
const moment = require("moment")

const {
  ctrlWrapper,
  HttpError,
  objForSearch,
  transformNotice,
} = require("../helpers")
const { noticeCategories } = require("../constants")

const getAll = async (req, res) => {
  const {
    page = 1,
    limit = 10,
    category = "",
    sex = "",
    date = "",
    query = "",
  } = req.query
  const findObject = objForSearch({ category, sex, date, query })
  const skip = (page - 1) * limit
  const result = await await Notice.find(findObject, "", { skip, limit })
  res.json(result.map(transformNotice))
}

const getFavorites = async (req, res) => {
  const { _id } = req.user
  const { favorites } = await User.findById(_id).populate("favorites")
  res.json({ favorites })
}

const getByOwner = async (req, res) => {
  const { _id: owner } = req.user
  const result = await Notice.find({ owner })
  res.json(result.map(transformNotice))
}

const getById = async (req, res) => {
  const { noticeId } = req.params
  const result = await Notice.findById(noticeId)
  if (!result) {
    throw HttpError(404, "Notice not found")
  }
  res.json(transformNotice(result))
}

const add = async (req, res) => {
  if (!req.file) {
    throw HttpError(400, "Missed required avatar form-data field")
  }
  const { _id: owner } = req.user
  const { path: file } = req.file
  const result = await Notice.create({ ...req.body, file, owner })
  if (result.category === noticeCategories.MYPET) {
    await User.findByIdAndUpdate(owner, { $push: { ownPets: result._id } })
  }
  res.status(201).json(transformNotice(result))
}

const deleteById = async (req, res) => {
  const { noticeId } = req.params
  const notice = await Notice.findById(noticeId)
  if (!notice._id) {
    throw HttpError(404, "Not found")
  }
  // Якщо власник notice не той що видаляє
  if (notice.owner.toString() !== req.user._id.toString()) {
    throw HttpError(403, "Notice owner is not you")
  }
  await User.updateMany(
    { favorites: notice._id },
    { $pull: { favorites: _id } }
  )
  // Лише якщо це категорія MYPET тоді видаляємо
  // вткористуючи notice.owner , це ефективніше
  if (notice.category === noticeCategories.MYPET) {
    await User.findByIdAndUpdate(notice.owner, {
      $pull: { ownPets: notice._id },
    })
  }
  await Notice.findByIdAndRemove(noticeId)
  res.json({ message: "Delete success" })
}

const toggleNoticeFavorite = async (req, res) => {
  const { _id, favorites } = req.user
  const { noticeId } = req.params
  const isInFavorites = favorites.some(itemId => noticeId === itemId.toString())
  const action = isInFavorites ? "$pull" : "$push"
  const newUser = await User.findByIdAndUpdate(
    _id,
    {
      [action]: { favorites: new Types.ObjectId(noticeId) },
    },
    { new: true }
  ).populate("favorites")
  res.json({ favorites: newUser.favorites })
}

module.exports = {
  getAll: ctrlWrapper(getAll),
  getFavorites: ctrlWrapper(getFavorites),
  getByOwner: ctrlWrapper(getByOwner),
  getById: ctrlWrapper(getById),
  add: ctrlWrapper(add),
  deleteById: ctrlWrapper(deleteById),
  toggleNoticeFavorite: ctrlWrapper(toggleNoticeFavorite),
}
