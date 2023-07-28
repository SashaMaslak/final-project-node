const { Notice } = require("../models/notice")
const { User } = require("../models/user")
const { Types } = require("mongoose")
const moment = require("moment")

const {
  ctrlWrapper,
  HttpError,
  objForSearch,
  transformNotice,
  transformMinifiedNotice,
  transformNoticeExtended,
} = require("../helpers")
const { noticeCategories } = require("../constants")

//get all and get for params
const getAll = async (req, res) => {
  const {
    page = 1,
    limit = 12,
    category = "",
    sex = "",
    date = "",
    query = "",
  } = req.query
  const findObject = objForSearch({ category, sex, date, query })
  const skip = (page - 1) * limit
  const result = await await Notice.find(findObject, "", { skip, limit })
  res.json({ notices: result.map(transformMinifiedNotice) })
}

const getMyPets = async (req, res) => {
  const { page = 1, limit = 12 } = req.query
  const skip = (page - 1) * limit
  const user = await req.user.populate([
    {
      path: "ownPets",
      options: { skip, limit },
    },
  ])
  res.json({ notices: user.ownPets.map(transformNotice) })
}

const getFavoriteAds = async (req, res) => {
  const { page = 1, limit = 12 } = req.query
  const skip = (page - 1) * limit
  const { favorites } = await req.user.populate({
    path: "favorites",
    options: { skip, limit },
  })
  res.json({ notices: favorites.map(transformMinifiedNotice) })
}

const getMyAds = async (req, res) => {
  const { _id: owner } = req.user
  const { page = 1, limit = 12 } = req.query
  const skip = (page - 1) * limit
  const result = await Notice.find({ owner }, "", { skip, limit })
  res.json({ notices: result.map(transformNotice) })
}

const getById = async (req, res) => {
  const { noticeId } = req.params
  const result = await Notice.findById(noticeId).populate("owner")
  if (!result) {
    throw HttpError(404, "Notice not found")
  }
  res.json({ notice: transformNoticeExtended(result) })
}

const add = async (req, res) => {
  if (!req.file) {
    throw HttpError(400, "Missed required avatar form-data field")
  }
  const { _id: owner } = req.user
  const { path: file } = req.file
  const result = await Notice.create({
    ...req.body,
    date: moment(req.body.date),
    file,
    owner,
  })
  if (result.category === noticeCategories.MYPET) {
    await User.findByIdAndUpdate(owner, { $push: { ownPets: result._id } })
  }
  res.status(201).json({ notice: transformNotice(result) })
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
  // використуючи notice.owner , це ефективніше
  if (notice.category === noticeCategories.MYPET) {
    await User.findByIdAndUpdate(notice.owner, {
      $pull: { ownPets: notice._id },
    })
  }
  await Notice.findByIdAndRemove(noticeId)
  res.json({ message: "Delete successfully" })
}

const toggleNoticeFavorite = async (req, res) => {
  const { _id, favorites } = req.user
  const { noticeId } = req.params
  const notice = await Notice.findById(noticeId)
  if (!notice) {
    throw HttpError(404, "Notice not found")
  }
  const isInFavorites = favorites.some(itemId => noticeId === itemId.toString())
  const action = isInFavorites ? "$pull" : "$push"
  const newUser = await User.findByIdAndUpdate(
    _id,
    {
      [action]: { favorites: new Types.ObjectId(noticeId) },
    },
    { new: true }
  )
  res.json({
    message: isInFavorites
      ? "Deleted from favorites successfully"
      : "Added to favorites successfully",
  })
}

module.exports = {
  getAll: ctrlWrapper(getAll),
  getMyPets: ctrlWrapper(getMyPets),
  getFavoriteAds: ctrlWrapper(getFavoriteAds),
  getMyAds: ctrlWrapper(getMyAds),
  getById: ctrlWrapper(getById),
  add: ctrlWrapper(add),
  deleteById: ctrlWrapper(deleteById),
  toggleNoticeFavorite: ctrlWrapper(toggleNoticeFavorite),
}
