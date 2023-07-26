const format = dateStr => {
  const date = new Date(dateStr)
  const day = String(date.getDate()).padStart(2, "0")
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const year = date.getFullYear()
  const result = `${day}-${month}-${year}`
  return result
}

const calcAge = dateStr => {
  const date = new Date(dateStr)
  const today = new Date()

  const yearDiff = today.getFullYear() - date.getFullYear()
  const monthDiff = today.getMonth() - date.getMonth()
  const dayDiff = today.getDate() - date.getDate()

  if (yearDiff === 0 && monthDiff === 0 && dayDiff === 0) {
    return "today"
  }

  let age = `${yearDiff} years`
  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age = `${yearDiff - 1} years`
  }

  if (age === "1 years") {
    age = "1 year"
  } else if (age === "0 years") {
    age = dayDiff < 0 ? `${monthDiff - 1} months` : `${monthDiff} months`
    age = age === "1 months" ? "1 month" : age
  }

  if (age === "0 months") {
    age = `${dayDiff} days`
    age = age === "1 days" ? "1 day" : age
  }

  return age
}

const transformDate = dateStr => {
  const dateArr = dateStr.split("-")
  const tmp = dateArr[0]
  dateArr[0] = dateArr[2]
  dateArr[2] = tmp
  return dateArr.join("-")
}

const transformMinifiedNotice = () => {
  const result = {
    id: obj._id,
    category: obj.category,
    file: obj.file,
  }
  if (obj.title) {
    result.title = obj.title
  }
  if (obj.date) {
    result.age = calcAge(obj.date)
  }
  if (obj.sex) {
    result.sex = obj.sex
  }
  if (obj.location) {
    result.location = obj.location
  }
  return result
}

const transformNotice = obj => {
  const result = {
    id: obj._id,
    category: obj.category,
    name: obj.name,
    type: obj.type,
    file: obj.file,
    comments: obj.comments,
  }
  if (obj.title) {
    result.title = obj.title
  }
  if (obj.date) {
    result.date = format(obj.date)
  }
  if (obj.sex) {
    result.sex = obj.sex
  }
  if (obj.location) {
    result.location = obj.location
  }
  if (obj.price) {
    result.price = obj.price
  }
  return result
}

const transformUser = obj => {
  return {
    id: obj._id,
    name: obj.name,
    email: obj.email,
    city: obj.city,
    phone: obj.phone,
    birthday: obj.birthday,
    avatar: obj.avatar,
  }
}

module.exports = {
  transformDate,
  transformMinifiedNotice,
  transformNotice,
  transformUser,
}
