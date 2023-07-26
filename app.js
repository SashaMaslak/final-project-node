const express = require("express")
const logger = require("morgan")
const cors = require("cors")

const authRouter = require("./routes/api/auth")
const noticesRouter = require("./routes/api/notices")
const apiDocsRouter = require("./routes/api/api-docs")

const app = express()

const formatsLogger = app.get("env") === "development" ? "dev" : "short"

app.use(logger(formatsLogger))
app.use(cors())
app.use(express.json())
app.use(express.static("public"))

app.use("/users", authRouter)

app.use("/notices", noticesRouter)

app.use("/api-docs", apiDocsRouter)

app.all("*", (req, res) => {
  res.status(404).json({ message: "Not found" })
})

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err
  res.status(status).json({ message })
})

module.exports = app
