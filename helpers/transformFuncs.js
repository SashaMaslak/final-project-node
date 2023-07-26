const format = dateStr => {
  const date = new Date(dateStr)
  const day = String(date.getDate()).padStart(2, "0")
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const year = date.getFullYear()
  const result = `${day}-${month}-${year}`
  return result
}

const transformDate = dateStr => {
  const dateArr = dateStr.split("-")
  const tmp = dateArr[0]
  dateArr[0] = dateArr[2]
  dateArr[2] = tmp
  return dateArr.join("-")
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
