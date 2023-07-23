const noticeCategories = require("./noticeCategories")
const noticeSexes = require("./noticeSexes")
const {
  dateRegex,
  onlyLettersRegex,
  emailRegex,
  pswRegex,
  phoneRegex,
} = require("./regex")

module.exports = {
  noticeCategories,
  noticeSexes,
  dateRegex,
  onlyLettersRegex,
  emailRegex,
  pswRegex,
  phoneRegex,
  imageFileLimit: 3 * 1024 * 1024,
}
