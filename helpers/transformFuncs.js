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

  let yearDiff = today.getFullYear() - date.getFullYear()
  let monthDiff = today.getMonth() - date.getMonth()
  let dayDiff = today.getDate() - date.getDate()

  if (yearDiff === 0 && monthDiff === 0 && dayDiff === 0) {
    return "today"
  }

  let age

  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    yearDiff -= 1
    age = yearDiff === 1 ? "1 year" : `${yearDiff} years`
  }

  if (yearDiff === 0) {
    monthDiff = monthDiff < 0 ? 12 + monthDiff : monthDiff
    monthDiff = dayDiff < 0 ? monthDiff - 1 : monthDiff
    age = monthDiff === 1 ? "1 month" : `${monthDiff} months`
  }

  if (monthDiff === 0) {
    const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0)
    dayDiff = dayDiff < 0 ? prevMonth.getDate() + dayDiff : dayDiff
    age = dayDiff === 1 ? "1 day" : `${dayDiff} day`
  }

  return age
}

const transformMinifiedNotice = obj => {
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
  transformMinifiedNotice,
  transformNotice,
  transformUser,
}
