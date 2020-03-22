(function (exports) {
    exports.event = {};
    exports.event.UPDATE = 11000;

    exports.editor = {};
    // Your code goes here
    exports.editor.ADD_PRIMITIVE = 2000;
    exports.editor.SET_BACKDROP = 2001;

    exports.project = {};
    exports.project.CREATE = 3000;
    exports.project.DELETE = 3001;
    exports.project.UPDATE = 3002;
    exports.project.SET_ACTIVE = 3003;
    exports.project.SHARE = 3004;
    exports.project.UNSHARE = 3005;
    exports.project.ATTACH_SCENE = 3006;
    exports.project.FIND = 3007;
    exports.project.FIND_ONE = 3008;
    exports.project.GET_ACTIVE = 3009;

    exports.bubbles = {};
    exports.bubbles.CREATE = 4000;
    exports.bubbles.UPDATE = 4001;
    exports.bubbles.DELETE = 4002;
    exports.bubbles.SET_ACTIVE = 4003;
    exports.bubbles.ADD_FLOWOBJECT = 4004;
    exports.bubbles.DEFINE_STATE = 4005;
    exports.bubbles.REMOVE_STATE = 4006;
    exports.bubbles.GET = 4007;
    exports.bubbles.GET_ALL = 4008;

    exports.states = {};
    exports.states.NEW = 5000;
    exports.states.UPDATE = 5001;
    exports.states.DELETE = 5002;
    exports.states.SET_ACTIVE = 5003;
    exports.states.GET = 5007;
    exports.states.GET_ALL = 5008;
    exports.states.TRANSITION = 5009;
    exports.states.ASSOCIATE_FLOW_OBJECT = 5010;
    exports.states.DISASSOCIATE_FLOW_OBJECT = 5011;

    exports.FlowObject = {};
    exports.FlowObject.CREATE = 6000;
    exports.FlowObject.UPDATE = 6001;
    exports.FlowObject.DELETE = 6002;
    exports.FlowObject.SET_PARENT = 6003;
    exports.FlowObject.GET = 6007;
    exports.FlowObject.SELECT = 6008;
    exports.FlowObject.DESELECT = 6009;
    exports.FlowObject.LOCK = 6010;
    exports.FlowObject.FREEZE = 6011;
    exports.FlowObject.panel = {};
    exports.FlowObject.TRANSFORM_UPDATE = 1;
    exports.FlowObject.PROPERTY_UPDATE = 6102;

    exports.FlowObject.command = {};
    exports.FlowObject.command.NEW = 6100;
    exports.FlowObject.command.TRANSLATE = 6101;
    exports.FlowObject.command.ROTATE = 6102;
    exports.FlowObject.command.SCALE = 6103;
    exports.FlowObject.command.SET_PROPERTY = 6104;

    exports.FlowObject.type = {};
    exports.FlowObject.type.PRIMITIVE_CUBE = 6200;
    exports.FlowObject.type.PRIMITIVE_SPHERE = 6201;
    exports.FlowObject.type.TEXT = 6202;
    exports.FlowObject.type.LINE = 6203;
    exports.FlowObject.type.GRID = 6204;

    exports.FlowMark = {};
    exports.FlowAnchor = {};

    exports.FlowSource = {};
    exports.FlowSource.CREATE = 7000;
    exports.FlowSource.UPDATE = 7001;
    exports.FlowSource.DELETE = 7002;

    exports.clients = {};
    exports.clients.register = 0;

    exports.annotations = {};

    exports.user = {};
    exports.user.CREATE = 10000;
    exports.user.UPDATE = 10001;
    exports.user.DELETE = 10002;
    exports.user.FIND = 10003;
    exports.user.SET_ACTIVE_PROJECT = 10004;
    exports.user.SET_ACTIVE_SCENE = 10005;
    exports.user.SET_ACTIVE_STATE = 10006;
    exports.user.GET_USERS = 8;

    exports.client = {};
    exports.client.REGISTER_CLIENT = 0;
    exports.client.LOGIN = 2;
    exports.client.MAKE_MASTER = 3;
    exports.client.CONNECTION_REESTABLISHED = 4;
    exports.client.NEW_CLIENT = 6;
    exports.client.LOGGING_IN = 7;
    exports.client.CLIENT_DISCONNECT = 10;
    exports.client.GET_CLIENTS = 13;
    exports.client.DELETE_CLIENT = 100;

    exports.TRANSFORM_UPDATE = 1;
    exports.ERROR = 5;
    exports.PING = 9;
    exports.PONG = 11;
    exports.user.NEW_USER = 12;


    exports.UPDATE_EXTENSIONS = 1000;
    exports.UPDATE_MODULES = 1001;
    exports.UPDATE_API = 1002;

    exports.ERROR_NO_CLIENT_FOUND = 0;

    exports.CLIENT_EDITOR = 0;
    exports.CLIENT_WEB = 1;
    exports.CLIENT_RIPPLE = 2;
    exports.CLIENT_HOLOLENS = 3;
    exports.CLIENT_MONITOR = 4;

    exports.STATE_CONNECTED = 0;
    exports.STATE_DISCONNECTED = 1;

    exports.test = function () {
        return 'hello world'
    };

})(typeof exports === 'undefined' ? this['commands'] = {} : module.exports);
