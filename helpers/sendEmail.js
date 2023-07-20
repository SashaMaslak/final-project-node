const sgEmail = require("@sendgrid/mail")
require("dotenv").config()

const { SENDGRID_API_KEY } = process.env

sgEmail.setApiKey(SENDGRID_API_KEY)

const sendEmail = async data => {
  const email = { ...data, from: "owmaslak@gmail.com" }
  await sgEmail.send(email)
  return true
}

module.exports = sendEmail

// const email = {
//   to: "xaciwa3239@bodeem.com",
//   from: "owmaslak@gmail.com",
//   subject: "Test email",
//   html: "<p><strong>Test email</strong>from localhost:3000</p>",
// }

// sgEmail
//   .send(email)
//   .then(() => console.log("Email send seccess from SendGrid"))
//   .catch(error => console.log(error.message))
