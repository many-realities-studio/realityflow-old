export class Commands {
    public static value = class {
        public static UPDATE = -1000;
        public static type = class {
            public static STRING = -1100;
            public static COLOR = -1101;
            public static VECTOR3 = -1102;
            public static VECTOR4 = -1103;
            public static INT = -1104;
            public static FLOAT = -1105;
        };
    };

    public static transform = class {
        public static UPDATE = -2000;
    };

    public static droplet = class {
        public static CREATE = 2000;
        public static NEW_INSTANCE = 2001;
        public static UPDATE = 2002;
        public static DELETE = 2003;

        public static types = class {
            public static PRIMITIVE = 2500;
            public static PLANE = 2501;
            public static QUAD = 2502;
            public static MESH = 2503;
            public static TEXT = 2504;
            public static SHAPE = 2505;
            public static LINE = 2506;
            public static primitive = class {
                public static PRIMITIVE_CUBE = 2100;
                public static PRIMITIVE_SPHERE = 2101;
                public static PRIMITIVE_CAPSULE = 2102;
                public static PRIMITIVE_CYLINDER = 2103;
            };
        };
    };

    public static modifier = class {
        public static APPLY = 8000;
        public static UPDATE = 8001;
        public static REMOVE = 8002;
        public static COMMIT = 8003;

        public static types = class {
            public static ARRAY = 8100;
            public static SCALE = 8101;
            public static TRANSLATE = 8102;
            public static ROTATE = 8103;
            public static COLOR = 8104;
            public static TEXTURE = 8105;
            public static SHADER = 8106;
        };
    };

    public static editor = class {
        // Your code goes here
        public static SET_BACKDROP = 10000;
    };

    public static project = class {
        public static DELETE = 3001;
        public static CREATE = 3000;
        public static UPDATE = 3002;
        public static SET_ACTIVE = 3003;
        public static SHARE = 3004;
        public static UNSHARE = 3005;
        public static ATTACH_SCENE = 3006;
        public static FIND = 3007;
        public static FIND_ONE = 3008;
        public static GET_ACTIVE = 3009;
        public static DRAFT = 3010;
    };

    public static states = class {
        public static NEW = 5000;
        public static UPDATE = 5001;
        public static DELETE = 5002;
        public static SET_ACTIVE = 5003;
        public static GET = 5007;
        public static GET_ALL = 5008;
        public static TRANSITION = 5009;
        public static ASSOCIATE_FLOW_OBJECT = 5010;
        public static DISASSOCIATE_FLOW_OBJECT = 5011;
    };

    public static user = class {
        public static CREATE = 10000;
        public static UPDATE = 10001;
        public static DELETE = 10002;
        public static FIND = 10003;
        public static SET_ACTIVE_PROJECT = 10004;
        public static SET_ACTIVE_SCENE = 10005;
        public static SET_ACTIVE_STATE = 10006;
        public static GET_USERS = 8;
    };

    public static client = class {
        public static REGISTER_CLIENT = 0;
        public static LOGIN = 2;
        public static MAKE_MASTER = 3;
        public static CONNECTION_REESTABLISHED = 4;
        public static NEW_CLIENT = 6;
        public static LOGGING_IN = 7;
        public static CLIENT_DISCONNECT = 10;
        public static GET_CLIENTS = 13;
        public static DELETE_CLIENT = 100;
    };

public static TRANSFORM_UPDATE = 1;
public static ERROR = 5;
public static PING = 9;
public static PONG = 11;
public static NEW_USER = 12;
public static UPDATE_EXTENSIONS = 1000;
public static UPDATE_MODULES = 1001;
public static UPDATE_API = 1002;
public static ERROR_NO_CLIENT_FOUND = 0;
public static CLIENT_EDITOR = 0;
public static CLIENT_WEB = 1;
public static CLIENT_MAGICLEAP = 2;
public static CLIENT_HOLOLENS = 3;
public static CLIENT_MONITOR = 4;
public static STATE_CONNECTED = 0;
public static STATE_DISCONNECTED = 1;
}
