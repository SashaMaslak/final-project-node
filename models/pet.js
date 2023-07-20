// const { Schema, model } = require("mongoose")

// const Joi = require("joi")

// const { handleMongooseError } = require("../helpers")

// const contactSchema = new Schema(
//   {
//     name: { type: String, required: [true, "Set name for contact"] },
//     email: { type: String },
//     phone: { type: String },
//     favorite: { type: Boolean, default: false },
//     owner: { type: Schema.Types.ObjectId, ref: "user", required: true },
//   },
//   { versionKey: false, timestamps: true }
// )

// contactSchema.post("save", handleMongooseError)

// const addSchemaContacts = Joi.object({
//   email: Joi.string().email().required(),
//   name: Joi.string().required(),
//   phone: Joi.string().required(),
//   owner: Joi.string(),
//   favorite: Joi.boolean(),
// })

// const updateFavoriteSchema = Joi.object({
//   favorite: Joi.boolean().required(),
// })

// const schemas = {
//   addSchemaContacts,
//   updateFavoriteSchema,
// }

// const Contact = model("contact", contactSchema)

// module.exports = { Contact, schemas }
