// const { Contact } = require("../models/contact.js")

// const { ctrlWrapper, HttpError } = require("../helpers")

// const getAll = async (req, res) => {
//   const { _id: owner } = req.user

//   console.log(req.query.favorite)

//   const { page = 1, limit = 25 } = req.query
//   const skip = (page - 1) * limit

//   const { favorite } = req.query

//   let objForFind = { owner }

//   if (favorite) {
//     objForFind = { owner, favorite }
//   }

//   const result = await Contact.find(objForFind, "-createdAt -updateAt", {
//     skip,
//     limit,
//   })
//     .sort({ _id: -1 })
//     .populate("owner", "name email")
//   res.json(result)
// }

// const getById = async (req, res) => {
//   const { contactId } = req.params
//   const result = await Contact.findById(contactId)
//   if (!result) {
//     throw HttpError(404, "Not found")
//   }
//   res.json(result)
// }

// const add = async (req, res) => {
//   const { _id: owner } = req.user
//   const result = await Contact.create({ ...req.body, owner })
//   res.status(201).json(result)
// }

// const updateById = async (req, res) => {
//   const { contactId } = req.params
//   console.log("req.params-->", req.params)

//   const result = await Contact.findByIdAndUpdate(contactId, req.body, {
//     new: true,
//   })
//   if (!result) {
//     throw HttpError(404, "Not found")
//   }
//   res.json(result)
// }

// const updateFavorite = async (req, res) => {
//   const { contactId } = req.params

//   const result = await Contact.findByIdAndUpdate(contactId, req.body, {
//     new: true,
//   })
//   if (!result) {
//     throw HttpError(404, "Not found")
//   }
//   res.json(result)
// }

// const deleteById = async (req, res) => {
//   const { contactId } = req.params
//   const result = await Contact.findByIdAndRemove(contactId)
//   if (!result) {
//     throw HttpError(404, "Not found")
//   }
//   res.json({ message: "Delete success" })
// }

// module.exports = {
//   getAll: ctrlWrapper(getAll),
//   getById: ctrlWrapper(getById),
//   add: ctrlWrapper(add),
//   updateById: ctrlWrapper(updateById),
//   updateFavorite: ctrlWrapper(updateFavorite),
//   deleteById: ctrlWrapper(deleteById),
// }
