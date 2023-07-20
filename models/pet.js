const { Schema, model } = require("mongoose")
const Joi = require("joi")

const { handleMongooseError } = require("../helpers")

const petSchema = new Schema(
  {
    name: {
      type: String,
      minlength: 3,
      maxlength: 20,
      required: [true, "Set name of pet"],
    },
    avatarURL: { type: String, required: [true, "Set photo for pet"] },
    owner: { type: Schema.Types.ObjectId, ref: "user", required: true },
    breed: { type: String, required: [true, "Set breed of pet"] },
    city: { type: String, required: [true, "Set city of pet"] },
    gender: {
      type: String,
      oneOf: ["female", "male"],
      required: [true, "Set gender of pet"],
    },
    type: {
      type: String,
      oneOf: ["yourPet", "sell", "lostFound", "inGoodHands"],
      required: [true, "Set gender of pet"],
    },
    birthday: {
      type: Date,
      required: [true, "Set date of pet"],
    },
  },
  { versionKey: false, timestamps: true }
)

petSchema.post("save", handleMongooseError)

const addPetSchemaPet = Joi.object({})

const schemas = {
  addSchemaContacts,
}

const Pet = model("contact", petSchema)

module.exports = { Pet, schemas }
