"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    _id: String,
    username: String,
    password: String
});
exports.User = mongoose.model("User", userSchema);
