const nodemailer = require("nodemailer")
require("dotenv").config()

const { META_PASSWORD } = process.env

const nodemailerConfig = {
  host: "smtp.meta.ua",
  port: 465,
  secure: true,
  auth: {
    user: "owms@meta.ua",
    pass: META_PASSWORD,
  },
}

const transport = nodemailer.createTransport(nodemailerConfig)

const email = {
  to: "xaciwa3239@bodeem.com",
  from: "owms@meta.ua",
  subject: "Test email",
  html: "<p><strong>Test email</strong>from localhost:3000</p>",
}

transport
  .sendEmail(email)
  .then(() => console.log("Email send seccess from Nodemailer"))
  .catch(error => console.log(error.message))

exports.module = {}
