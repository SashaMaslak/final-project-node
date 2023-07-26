const axios = require("axios")
require("dotenv").config()

const { ctrlWrapper, getEnv } = require("../helpers")

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = process.env
const { BASE_URL, BASE_URL_FRONTEND } = getEnv()

const googleAuth = async (req, res) => {
  const stringifiedParams = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: `${BASE_URL}/auth/google-redirect`,
    scope: [
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/userinfo.profile",
    ].join(" "),
    response_type: "code",
    access_type: "offline",
    prompt: "consent",
  })
  res.redirect(
    `https://accounts.google.com/o/oauth2/v2/auth?${stringifiedParams}`
  )
}

const googleRedirect = async (req, res) => {
  const fullUrl = `${req.protocol}://${req.get("host")}${req.originalUrl}`
  const urlObj = new URL(fullUrl)
  const urlParams = new URLSearchParams(urlObj.search)
  const code = urlParams.get("code")
  const { data: tokenData } = await axios.post(
    "https://oauth2.googleapis.com/token",
    {
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      redirect_uri: `${BASE_URL}/auth/google-redirect`,
      grant_type: "authorization_code",
      code,
    }
  )
  const { data: userData } = await axios.get(
    "https://www.googleapis.com/oauth2/v2/userinfo",
    {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    }
  )

  // {
  //   id: "117798264081435904781",
  //   email: "melnykmyron1808@gmail.com",
  //   verified_email: true,
  //   name: "Мирон Мельник",
  //   given_name: "Мирон",
  //   family_name: "Мельник",
  //   picture:
  //     "https://lh3.googleusercontent.com/a/AAcHTtfBZ45X22pLmrIXMyQfMBZ3SRuRGW3hqqt9mmJBYbXdvho=s96-c",
  //   locale: "uk",
  // }

  res.redirect(`${BASE_URL_FRONTEND}?email=${userData.email}`)
}

module.exports = {
  googleAuth: ctrlWrapper(googleAuth),
  googleRedirect: ctrlWrapper(googleRedirect),
}
