const noticeCategories = require("./noticeCategories")
const noticeSexes = require("./noticeSexes")
const {
  dateRegex,
  onlyLettersRegex,
  cityRegex,
  emailRegexp,
  pswRegexp,
} = require("./regex")

module.exports = {
  noticeCategories,
  noticeSexes,
  dateRegex,
  onlyLettersRegex,
  cityRegex,
  emailRegexp,
  pswRegexp,
  imageFileLimit: 3 * 1024 * 1024,
}
