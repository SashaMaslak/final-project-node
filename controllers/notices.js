const { Notice } = require("../models/notice")
const { User } = require("../models/user")

const { ctrlWrapper, HttpError } = require("../helpers")
const { noticeCategories } = require("../constants")

const add = async (req, res) => {
  if (!req.file) {
    throw HttpError(400, "Missed required avatar form-data field")
  }
  const { _id: owner } = req.user
  const { path: file } = req.file
  const result = await Notice.create({ ...req.body, file, owner })
  if (result.category === noticeCategories.MYPET) {
    await User.findByIdAndUpdate(owner, { $push: { ownPets: result } })
  }
  res.status(201).json(result)
}

const deleteById = async (req, res) => {
  const { noticeId } = req.params
  const notice = await Notice.findById(noticeId)
  if (!notice._id) {
    throw HttpError(404, "Not found")
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

module.exports = {
  add: ctrlWrapper(add),
  deleteById: ctrlWrapper(deleteById),
}
