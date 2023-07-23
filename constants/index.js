const noticeCategories = require("./noticeCategories")
const noticeSexes = require("./noticeSexes")
const dateFilterOptions = require("./dateFilterOptions")
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
  dateFilterOptions,
  dateRegex,
  onlyLettersRegex,
  emailRegex,
  pswRegex,
  phoneRegex,
  imageFileLimit: 3 * 1024 * 1024,
}
