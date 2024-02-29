const mongoose = require("mongoose")
const Schema = mongoose.Schema

const PostSchema = new Schema({
    title: { type: String, required: true },
    text: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    comments: [ { type: String, required: true } ]
})

module.exports = Schema.model("Post", PostSchema)