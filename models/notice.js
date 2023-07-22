const { Schema, model, Types } = require("mongoose")
const Joi = require("joi")

const { handleMongooseError, HttpError } = require("../helpers")
const { User } = require("./user")
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
    title: {
      type: String,
      minlength: 4,
      maxlength: 32,
      required: [true, "Set a title for the pet"],
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
      required: [true, "Set a date for the pet"],
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
      required: function () {
        return this.category === noticeCategories.SELL
      },
    },
    comments: {
      type: String,
      maxlength: 140,
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

/**
 * Схеми Joi (addNoticeSchema)
 */
const addNoticeSchema = Joi.object({
  category: Joi.string()
    .valid(...Object.values(noticeCategories))
    .required(),
  title: Joi.string().min(3).max(32).required(),
  name: Joi.string().min(2).max(16).required(),
  date: Joi.string().pattern(dateRegex).required(),
  type: Joi.string().min(2).max(16).pattern(onlyLettersRegex).required(),
  file: Joi.string().required(),
  sex: Joi.string()
    .valid(...Object.values(noticeSexes))
    .when("category", {
      is: Joi.valid(
        noticeCategories.SELL,
        noticeCategories.LOSTFOUND,
        noticeCategories.FORFREE
      ),
      then: Joi.required(),
    }),
  location: Joi.string()
    .pattern(cityRegex)
    .when("category", {
      is: Joi.valid(
        noticeCategories.SELL,
        noticeCategories.LOSTFOUND,
        noticeCategories.FORFREE
      ),
      then: Joi.required(),
    }),
  price: Joi.number()
    .min(1)
    .when("category", {
      is: Joi.valid(noticeCategories.SELL),
      then: Joi.required(),
    }),
  comments: Joi.string().max(140),
})

const schemas = {
  addNoticeSchema,
}

const Notice = model("notice", noticeSchema)

module.exports = { Notice, schemas }
