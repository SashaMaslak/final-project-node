const { Schema, model } = require("mongoose")

const Joi = require("joi")

const { handleMongooseError } = require("../helpers")
const { dateRegex, emailRegexp, pswRegexp } = require("../constants")

const userSchema = new Schema(
  {
    name: { type: String, required: [true, "Set name"] },
    email: {
      type: String,
      unique: true,
      match: emailRegexp,
      required: [true, "Email is required"],
    },
    password: {
      type: String,
      minlength: 6,
      maxlength: 16,
      match: pswRegexp,
      required: [true, "Set password for user"],
    },
    city: {
      type: String,
      default: "",
    },
    phone: {
      type: String,
      default: "",
    },
    birthday: {
      type: String,
      match: dateRegex,
    },
    favorites: {
      type: [String],
      ref: "notice",
      default: [],
    },
    ownPets: {
      type: [String],
      ref: "notice",
      default: [],
    },
    avatar: { type: String },
    token: {
      type: String,
      default: "",
    },
    verify: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      required: [true, "Verify token is required"],
      default: "",
    },
  },
  { versionKey: false, timestamps: true }
)

userSchema.post("save", handleMongooseError)

const registerSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().min(6).required(),
})

const emailSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required(),
})

const loginSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().min(6).required(),
})

const updateSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().pattern(emailRegexp).required(),
})

const schemas = {
  registerSchema,
  loginSchema,
  updateSchema,
  emailSchema,
}

const User = model("user", userSchema)

module.exports = { User, schemas }
