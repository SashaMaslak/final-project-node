const { format } = require("date-fns")

const transformNotice = obj => {
  return {
    category: obj.category,
    title: obj.title,
    name: obj.name,
    date: format(new Date(obj.date), "dd-MM-yyyy"),
    type: obj.type,
    file: obj.file,
    sex: obj.sex,
    location: obj.location,
    comments: obj.comments,
  }
}

module.exports = transformNotice
