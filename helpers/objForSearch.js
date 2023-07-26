const { dateFilterOptions } = require("../constants")

const { UNDERONEYEAR, ONEYEAR, TWOYEARS } = dateFilterOptions

const today = new Date()

const threeMonthAgo = new Date(
  today.getFullYear(),
  today.getMonth() - 3,
  today.getDate()
)

const yearAgo = new Date(
  today.getFullYear() - 1,
  today.getMonth(),
  today.getDate()
)

const twoYearsAgo = new Date(
  today.getFullYear() - 2,
  today.getMonth(),
  today.getDate()
)

const filterAge = option => {
  switch (option) {
    case UNDERONEYEAR:
      return { $gt: yearAgo, $lte: threeMonthAgo }
    case ONEYEAR:
      return { $gt: twoYearsAgo, $lte: yearAgo }
    case TWOYEARS:
      return { $gt: new Date(), $lte: twoYearsAgo }
    default:
      return null
  }
}

const filterByKeyword = keyword => {
  return [
    { title: { $regex: new RegExp(keyword), $options: "i" } },
    { name: { $regex: new RegExp(keyword), $options: "i" } },
    { type: { $regex: new RegExp(keyword), $options: "i" } },
  ]
}

const objForSearch = obj => {
  const newObj = {}
  for (const key in obj) {
    if (obj[key]) {
      switch (key) {
        case "query":
          newObj["$or"] = filterByKeyword(obj[key])
          break
        case "date":
          newObj["date"] = filterAge(obj[key])
          break
        default:
          newObj[key] = obj[key]
      }
    }
  }
  return newObj
}

module.exports = objForSearch
