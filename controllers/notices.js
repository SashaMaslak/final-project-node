const { Notice } = require("../models/notice")

const { ctrlWrapper, HttpError } = require("../helpers")

const add = async (req, res) => {
  const { _id: owner } = req.user
  const result = await Notice.create({ ...req.body, owner })
  res.status(201).json(result)
}

const deleteById = async (req, res) => {
  const { contactId } = req.params
  const result = await Notice.findByIdAndRemove(contactId)
  if (!result) {
    throw HttpError(404, "Not found")
  }
  res.json({ message: "Delete success" })
}

module.exports = {
  add: ctrlWrapper(add),
  deleteById: ctrlWrapper(deleteById),
}
