"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const user_1 = require("../models/user");
var objectId = mongoose.Types.ObjectId();
const bcrypt = require('bcrypt');
const saltRounds = 10;
class UserOperations {
    static createUser(userInfo) {
        var newUser;
        var hashedUserInfo = this.hashUserInfo(userInfo.username, userInfo.password);
        var newUser = new user_1.User({
            username: userInfo.username,
            password: hashedUserInfo.password,
            clients: undefined,
            activeProject: undefined,
            projects: undefined,
            friends: undefined
        });
        var promise = newUser.save();
        promise.then(function (err, doc) {
            newUser = doc;
            return newUser;
        });
        return promise;
    }
    static findUser(userInfo) {
        var returnedUser = null;
        var promise = user_1.User.find({ username: userInfo.username }).exec();
        promise.catch(function (err) {
            console.log("BERROR:\n" + err);
        });
        promise.then(function (doc) {
            if (doc)
                returnedUser = doc;
            return returnedUser;
        });
        return promise;
    }
    static loginUser(userInfo) {
        var hashedUserInfo = this.hashUserInfo(userInfo.username, userInfo.password);
        var promise = user_1.User.findOne({ username: userInfo.username }).exec();
        promise.then(function (doc) {
            return doc;
        });
        return promise;
    }
    static updateUser(userInfo) {
        var hashedUserInfo = this.hashUserInfo(userInfo.username, userInfo.password);
        user_1.User.findOneAndUpdate({ _id: userInfo._id }, {
            username: userInfo.username,
            password: hashedUserInfo.password,
            clients: userInfo.clients,
            activeProject: userInfo.activeProject,
            projects: userInfo.projects,
            friends: userInfo.friends
        }, function (err) {
            if (err) {
                console.log('ERROR: Failed to update user: ' + userInfo.username);
            }
            else {
                console.log('User ' + userInfo.username + ' updated successfully.');
            }
        });
    }
    static deleteUser(userInfo) {
        user_1.User.findByIdAndDelete(userInfo._id);
    }
    static hashUserInfo(username, password) {
        var hashedUserName = bcrypt.hashSync(username, saltRounds);
        var hashedPassword = bcrypt.hashSync(password, saltRounds);
        var hashedUserInfo = {
            username: hashedUserName,
            password: hashedPassword
        };
        return hashedUserInfo;
    }
}
exports.UserOperations = UserOperations;
