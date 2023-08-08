const mongoose = require('mongoose')

const Schema = mongoose.Schema

const userSchema = new Schema({
    username: {type: String, required: true},
    score: {type: String, required: true},
})

const Score = mongoose.model("score", userSchema)

module.exports = Score