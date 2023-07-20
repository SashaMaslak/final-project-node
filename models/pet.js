const { Schema, model } = require("mongoose")
const Joi = require("joi")

const { handleMongooseError } = require("../helpers")
const {
  petCategories,
  petSexes,
  dateRegex,
  onlyLettersRegex,
  cityRegex,
} = require("../constants")

const petSchema = new Schema(
  {
    category: {
      type: String,
      enum: Object.values(petCategories),
      required: [true, "Set a category for the pet"],
    },
    name: {
      type: String,
      minlength: 2,
      maxlength: 16,
      match: onlyLettersRegex,
      required: [true, "Set a name for the pet"],
    },
    date: {
      type: String,
      match: dateRegex,
      required: function () {
        return (
          this.category === petCategories.SELL ||
          this.category === petCategories.FORFREE
        )
      },
    },
    type: {
      type: String,
      minlength: 2,
      maxlength: 16,
      match: onlyLettersRegex,
      required: [true, "Set a name for the pet"],
    },
    file: {
      type: String,
      required: [true, "Set a photo for the pet"],
    },
    sex: {
      type: String,
      enum: Object.values(petSexes),
      required: function () {
        return (
          this.category === petCategories.SELL ||
          this.category === petCategories.LOSTFOUND ||
          this.category === petCategories.FORFREE
        )
      },
    },
    location: {
      type: String,
      match: cityRegex,
      required: function () {
        return (
          this.category === petCategories.SELL ||
          this.category === petCategories.LOSTFOUND ||
          this.category === petCategories.FORFREE
        )
      },
    },
    price: {
      type: Number,
      min: 1,
    },
    comments: {
      type: String,
      maxlength: 120,
      default: "",
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  { versionKey: false, timestamps: true }
)

petSchema.post("save", handleMongooseError)

const addPetSchemaPet = Joi.object({})

const schemas = {
  addSchemaContacts,
}

const Pet = model("pet", petSchema)

module.exports = { Pet, schemas }
