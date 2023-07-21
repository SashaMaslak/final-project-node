const { Schema, model } = require("mongoose")
const Joi = require("joi")

const { handleMongooseError } = require("../helpers")
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
noticeSchema.pre("remove", async function (next) {
  try {
    /**
     * Видаляє усі посилання на notice
     * у масивах favorites та myPets
     */
    await User.updateMany(
      { favorites: this._id },
      { $pull: { parentsIdArray: this._id } }
    )

    next()
  } catch (err) {
    next(err)
  }
})

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
    .required(),
  location: Joi.string().pattern(cityRegex).required(),
  price: Joi.number().min(1).required(),
  comments: Joi.string().max(140),
})

const schemas = {
  addNoticeSchema,
}

const Notice = model("notice", noticeSchema)

module.exports = { Notice, schemas }
