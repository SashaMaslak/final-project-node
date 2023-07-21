const { Schema, model } = require("mongoose")
const Joi = require("joi")

const { handleMongooseError } = require("../helpers")
const {
  noticeCategories,
  noticeSexes,
  dateRegex,
  onlyLettersRegex,
  cityRegex,
} = require("../constants")

const noticeSchema = new Schema(
  {
    category: {
      type: String,
      enum: Object.values(noticeCategories),
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
          this.category === noticeCategories.SELL ||
          this.category === noticeCategories.FORFREE
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
      enum: Object.values(noticeSexes),
      required: function () {
        return (
          this.category === noticeCategories.SELL ||
          this.category === noticeCategories.LOSTFOUND ||
          this.category === noticeCategories.FORFREE
        )
      },
    },
    location: {
      type: String,
      match: cityRegex,
      required: function () {
        return (
          this.category === noticeCategories.SELL ||
          this.category === noticeCategories.LOSTFOUND ||
          this.category === noticeCategories.FORFREE
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

noticeSchema.post("save", handleMongooseError)

const addNoticeSchema = Joi.object({
  category,
  name,
  date,
  type,
  file,
  sex,
  location,
  price,
  comments,
})

const schemas = {
  addNoticeSchema,
}

const Notice = model("notice", noticeSchema)

module.exports = { Notice, schemas }
