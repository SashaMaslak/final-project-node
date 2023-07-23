const { Schema, model } = require("mongoose")

const Joi = require("joi")

const { handleMongooseError } = require("../helpers")
const { dateRegex, emailRegex, pswRegex, phoneRegex } = require("../constants")

const userSchema = new Schema(
  {
    name: {
      type: String,
      minlength: 2,
      maxlength: 16,
      required: [true, "Set name"],
    },
    email: {
      type: String,
      unique: true,
      match: emailRegex,
      required: [true, "Email is required"],
    },
    password: {
      type: String,
      minlength: 6,
      match: pswRegex,
      required: [true, "Set password for user"],
    },
    city: {
      type: String,
      minlength: 2,
      default: "",
    },
    phone: {
      type: String,
      match: phoneRegex,
      default: "",
    },
    birthday: {
      type: String,
      match: dateRegex,
    },
    favorites: [{ type: Schema.Types.ObjectId, ref: "notice" }],
    ownPets: [{ type: Schema.Types.ObjectId, ref: "notice" }],
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
  name: Joi.string().min(2).required(),
  email: Joi.string().pattern(emailRegex).required(),
  password: Joi.string().min(6).max(16).required(),
})

const emailSchema = Joi.object({
  email: Joi.string().pattern(emailRegex).required(),
})

const loginSchema = Joi.object({
  email: Joi.string().pattern(emailRegex).required(),
  password: Joi.string().min(6).max(16).required(),
})

const updateSchema = Joi.object({
  name: Joi.string().min(2).required(),
  email: Joi.string().pattern(emailRegex).required(),
  phone: Joi.string().pattern(phoneRegex),
  birthday: Joi.string().pattern(dateRegex),
  city: Joi.string().min(2),
})

const schemas = {
  registerSchema,
  loginSchema,
  updateSchema,
  emailSchema,
}

const User = model("user", userSchema)

module.exports = { User, schemas }
