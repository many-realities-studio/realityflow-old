"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
var Schema = mongoose.Schema;
var Types = Schema.Types;
var ObjectId = Types.ObjectId;
const project_1 = require("./project");
const bcrypt = require("bcrypt");
let SALT_WORK_FACTOR = 10;
const userSchema = new mongoose.Schema({
    Username: { type: String, required: true },
    Password: { type: String, required: true },
    Projects: [{ type: ObjectId, ref: project_1.Project }],
}, { usePushEach: true });
userSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!this.isModified("Password"))
            return next();
        this.Password = yield bcrypt.hash(this.Password, SALT_WORK_FACTOR);
        console.log(this.Password);
        next();
    });
});
userSchema.methods.comparePassword = function (candidatePassword, callback) {
    callback(null, bcrypt.compareSync(candidatePassword, this.Password));
};
exports.User = mongoose.model("User", userSchema);
//# sourceMappingURL=user.js.map