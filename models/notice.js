const { Schema, model } = require("mongoose")
const Joi = require("joi")

const { handleMongooseError, HttpError } = require("../helpers")
const { User } = require("./user")
const {
  noticeCategories,
  noticeSexes,
  dateRegex,
  onlyLettersRegex,
  cityRegex,
  dateFilterOptions,
} = require("../constants")
const { SELL, LOSTFOUND, FORFREE, MYPET } = noticeCategories

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
      type: Date,
      required: function () {
        const isRequired = isOneOf(this.category, SELL, FORFREE, MYPET)
        return [isRequired, "Set a date for the pet"]
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
        const isRequired = isOneOf(this.category, SELL, LOSTFOUND, FORFREE)
        return [isRequired, "Set a sex for the pet"]
      },
    },
    location: {
      type: String,
      minlength: 2,
      required: function () {
        const isRequired = isOneOf(this.category, SELL, LOSTFOUND, FORFREE)
        return [isRequired, "Set a location for the pet"]
      },
    },
    price: {
      type: Number,
      min: 1,
      required: function () {
        const isRequired = isOneOf(this.category, SELL)
        return [isRequired, "Set a price for the pet"]
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
  date: Joi.string()
    .pattern(dateRegex)
    .when("category", {
      is: Joi.valid(SELL, FORFREE, MYPET),
      then: Joi.required(),
    }),
  type: Joi.string().min(2).max(16).pattern(onlyLettersRegex).required(),
  sex: Joi.string()
    .valid(...Object.values(noticeSexes))
    .when("category", {
      is: Joi.valid(SELL, LOSTFOUND, FORFREE),
      then: Joi.required(),
    }),
  location: Joi.string()
    .pattern(cityRegex)
    .when("category", {
      is: Joi.valid(SELL, LOSTFOUND, FORFREE),
      then: Joi.required(),
    }),
  price: Joi.number()
    .min(1)
    .when("category", {
      is: Joi.valid(SELL),
      then: Joi.required(),
    }),
  comments: Joi.string().max(140),
})

const paramsNoticeSchema = Joi.object({
  page: Joi.number().min(0),
  limit: Joi.number().min(0),
  category: Joi.string().valid(...Object.values(noticeCategories)),
  gender: Joi.string().valid(...Object.values(noticeSexes)),
  date: Joi.string().valid(...Object.values(dateFilterOptions)),
  query: Joi.string().max(32),
})

const schemas = {
  addNoticeSchema,
  paramsNoticeSchema,
}

const Notice = model("notice", noticeSchema)

module.exports = { Notice, schemas }
