const { Notice } = require("../models/notice")
const { User } = require("../models/user")

const { ctrlWrapper, HttpError } = require("../helpers")

const add = async (req, res) => {
  console.log(req.body)
  if (!req.file) {
    throw HttpError(400, "Missed required avatar form-data field")
  }
  const { _id: owner } = req.user
  const { path: file } = req.file
  const result = await Notice.create({ ...req.body, file, owner })
  res.status(201).json(result)
}

const deleteById = async (req, res) => {
  const { noticeId } = req.params
  const { _id } = await Notice.findById(noticeId)

  if (!_id) {
    throw HttpError(404, "Not found")
  }

  await User.updateMany({ favorites: _id }, { $pull: { favorites: _id } })
  await Notice.findByIdAndRemove(noticeId)

  res.json({ message: "Delete success" })
}

module.exports = {
  add: ctrlWrapper(add),
  deleteById: ctrlWrapper(deleteById),
}
