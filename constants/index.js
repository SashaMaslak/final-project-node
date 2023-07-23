const noticeCategories = require("./noticeCategories")
const noticeSexes = require("./noticeSexes")
const dateFilterOptions = require("./dateFilterOptions")
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
  dateFilterOptions,
  dateRegex,
  onlyLettersRegex,
  cityRegex,
  emailRegexp,
  pswRegexp,
  imageFileLimit: 3 * 1024 * 1024,
}
