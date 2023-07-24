const format = dateStr => {
  const date = new Date(dateStr)
  const day = String(date.getDate()).padStart(2, "0")
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const year = date.getFullYear()
  const result = `${day}-${month}-${year}`
  return result
}

const transformNotice = obj => {
  return {
    _id: obj._id,
    category: obj.category,
    title: obj.title,
    name: obj.name,
    date: format(obj.date),
    type: obj.type,
    file: obj.file,
    sex: obj.sex,
    location: obj.location,
    comments: obj.comments,
  }
}

module.exports = transformNotice
