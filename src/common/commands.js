"use strict";
exports.__esModule = true;
var Commands = /** @class */ (function () {
    function Commands() {
    }
    var _a, _b;
    Commands.request = (_a = /** @class */ (function () {
            function class_1() {
            }
            return class_1;
        }()),
        _a.object = 1,
        _a.project = 2,
        _a.scene = 3,
        _a.user = 4,
        _a.client = 5,
        _a.interaction = 6,
        _a);
    Commands.action = (_b = /** @class */ (function () {
            function class_2() {
            }
            return class_2;
        }()),
        _b.CREATE = 1,
        _b.FETCH = 2,
        _b.UPDATE = 3,
        _b.DELETE = 4,
        // not yet implemented
        _b.FETCH_LIST = 5,
        // user-specific
        _b.LOGIN = 6,
        _b.LOGOUT = 7,
        // project-specific
        // not yet implemented 
        _b.ADD_USER = 8,
        _b);
    Commands.commented = {
    // public static object = class {
    //     public static CREATE = 2000;
    //     public static DELETE = 2002;
    //     public static UPDATE = 2001;
    // };
    // public static project = class {
    //     public static DELETE = 3009;
    //     public static CREATE = 3000;
    //     public static UPDATE = 3002;
    //     public static FETCH = 3003;
    //     public static ADD_USER = 3005;
    //     public static OPEN = 3007;
    //     // ask steven
    //     public static FIND_ONE = 3008;
    // };
    // public static scene = class {
    //     public static CREATE = 4000;
    //     public static UPDATE = 4001;
    //     public static DELETE = 4002;
    // };
    // public static user = class {
    //     public static CREATE = 10000;
    //     public static UPDATE = 10001;
    //     public static LOGIN = 10002;
    //     public static LOGOUT = 10003;
    //     public static FIND = 10004;
    //     public static DELETE = 10005;
    // };
    // public static client = class {
    //     public static REGISTER_CLIENT = 5000;
    //     public static LOGIN = 5001;
    //     public static MAKE_MASTER = 3;
    //     public static CONNECTION_REESTABLISHED = 4;
    //     public static NEW_CLIENT = 6;
    //     public static LOGGING_IN = 7;
    //     public static CLIENT_DISCONNECT = 10;
    //     public static GET_CLIENTS = 13;
    //     public static DELETE_CLIENT = 100;
    // };
    };
    Commands.TRANSFORM_UPDATE = 1;
    Commands.ERROR = 5;
    Commands.PING = 9;
    Commands.PONG = 11;
    Commands.NEW_USER = 12;
    Commands.UPDATE_EXTENSIONS = 1000;
    Commands.UPDATE_MODULES = 1001;
    Commands.UPDATE_API = 1002;
    Commands.ERROR_NO_CLIENT_FOUND = 0;
    Commands.CLIENT_EDITOR = 0;
    Commands.CLIENT_WEB = 1;
    Commands.CLIENT_MAGICLEAP = 2;
    Commands.CLIENT_HOLOLENS = 3;
    Commands.CLIENT_MONITOR = 4;
    Commands.STATE_CONNECTED = 0;
    Commands.STATE_DISCONNECTED = 1;
    return Commands;
}());
exports.Commands = Commands;
