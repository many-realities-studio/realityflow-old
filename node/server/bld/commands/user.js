"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const user_1 = require("../models/user");
var objectId = mongoose.Types.ObjectId();
class UserOperations {
    static createUser(userInfo) {
        var newUser;
        console.log('Entering CreateUser...');
        console.log('UserInfo Username: ' + userInfo.username);
        console.log('UserInfo Password: ' + userInfo.password);
        var hashedUserInfo = this.hashUserInfo(userInfo.username, userInfo.password);
        var newUser = new user_1.User({
            username: userInfo.username,
            password: userInfo.password,
            clients: undefined,
            activeProject: undefined,
            projects: undefined,
            friends: undefined
        });
        console.log('User Presave: ' + newUser);
        var promise = newUser.save();
        console.log('Save User: ' + newUser);
        promise.then(function (err, doc) {
            console.log('User ' + userInfo.username + ' added successfully.');
            newUser = doc;
            return newUser;
        });
        return promise;
    }
    static findUser(userInfo) {
        var returnedUser;
        var promise = user_1.User.findById({ _id: userInfo._id }).exec();
        promise.then(function (err, doc) {
            returnedUser = doc;
            return returnedUser;
        });
        return promise;
    }
    static loginUser(userInfo) {
        var returnedUser = {
            isLoggedIn: false,
            _id: ''
        };
        var hashedUserInfo = this.hashUserInfo(userInfo.username, userInfo.password);
        console.log("looking for user: " + userInfo.username + " with password: " + userInfo.password);
        var promise = user_1.User.findOne({ username: "test", password: "test" }).exec();
        promise.then(function (doc) {
            if (doc == undefined) {
                returnedUser.isLoggedIn = false;
                console.log('No doc found');
            }
            else {
                returnedUser.isLoggedIn = true;
                returnedUser._id = doc._id;
            }
            console.log('Returned User payload Doc: ' + doc);
            console.log('Returned User isLoggedIn: ' + returnedUser.isLoggedIn);
            console.log('Returned User ID: ' + returnedUser._id);
            return returnedUser;
        });
        return promise;
    }
    static updateUser(userInfo) {
        var hashedUserInfo = this.hashUserInfo(userInfo.username, userInfo.password);
        user_1.User.findOneAndUpdate({ _id: userInfo._id }, {
            username: hashedUserInfo.username,
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
        const bcrypt = require('bcrypt');
        const saltRounds = 10;
        var hashedUserName = bcrypt.hash(username, saltRounds);
        var hashedPassword = bcrypt.hash(password, saltRounds);
        var hashedUserInfo = {
            username: hashedUserName,
            password: hashedPassword
        };
        return hashedUserInfo;
    }
}
exports.UserOperations = UserOperations;
