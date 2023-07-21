const petCategories = require("./petCategories")
const petSexes = require("./petSexes")
const { dateRegex, onlyLettersRegex, cityRegex } = require("./regex")

module.exports = {
  petCategories,
  petSexes,
  dateRegex,
  onlyLettersRegex,
  cityRegex,
  emailRegexp,
  pswRegexp,
}
