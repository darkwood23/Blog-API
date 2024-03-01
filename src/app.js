const express = require("express")
const mongoose = require("mongoose")
const catalogRouter = require("./catalog")

require("dotenv").config()

const mongoDb = process.env.LOG_IN
mongoose.connect(mongoDb)
const db = mongoose.connection
db.on("error", console.error.bind(console, "mongo connection error"))

const app = express()

app.use("/", catalogRouter)

app.listen(3000, () => console.log("Server is listening on port 3000..."))