"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = require("../models/user");
let sockServ;
let user_hash;
let client_hash;
class UserOperations {
    static createUser(userInfo) {
        var newUser;
        var hashedUserInfo = this.hashUserInfo(userInfo.username, userInfo.password);
        var newUser = new user_1.User({
            username: hashedUserInfo.username,
            password: hashedUserInfo.password,
            clients: undefined,
            activeProject: undefined,
            projects: undefined,
            friends: undefined
        });
        newUser.save(function (err, doc) {
            if (err) {
                console.log('ERROR: Failed to create user: ' + userInfo.username);
            }
            else {
                console.log('User ' + userInfo.username + ' added successfully.');
                newUser = doc;
            }
        });
        return newUser;
    }
    static findUser(userInfo) {
        var returnedUser;
        user_1.User.findById({ _id: userInfo._id }, function (err, doc) {
            returnedUser = doc;
        });
        return returnedUser;
    }
    static loginUser(userInfo) {
        var returnedUser = {
            isLoggedIn: false,
            _id: ''
        };
        var hashedUserInfo = this.hashUserInfo(userInfo.username, userInfo.password);
        user_1.User.find({ username: hashedUserInfo.username, password: hashedUserInfo.password }, { lean: true }, function (err, doc) {
            if (err) {
                console.log('Error');
                returnedUser.isLoggedIn = false;
            }
            else if (!doc) {
                returnedUser.isLoggedIn = false;
            }
            else {
                returnedUser.isLoggedIn = true;
                returnedUser._id = doc._id;
            }
        });
        return returnedUser;
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
