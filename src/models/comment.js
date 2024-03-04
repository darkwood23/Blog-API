const mongoose = require("mongoose")
const Schema = mongoose.Schema

const CommentSchema = new Schema({
    user: { type: String, required: true },
    text: { type: String, required: true },
    post: { type: Schema.Types.ObjectId, ref: "Post" }
})

module.exports = mongoose.model("Comment", CommentSchema)