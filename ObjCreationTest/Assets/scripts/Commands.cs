public class Commands
{
    public class Transform
    {
        public const int UPDATE = -2000;
    }
    public class FlowObject {
        public const int CREATE = 1501;
    }
    public class Value
    {
        public const int UPDATE = -1000;
        public class type
        {
            public const int STRING = -1100;
            public const int COLOR = -1101;
            public const int VECTOR3 = -1102;
            public const int VECTOR4 = -1103;
            public const int INT = -1104;
            public const int FLOAT = -1105;
        }
    }
    public class Droplet
    {
        public const int CREATE = 2000;
        public const int NEW_INSTANCE = 2001;
        public const int UPDATE = 2002;
        public const int DELETE = 2003;
        public const int SET_TYPE = 2004;
        public class types
        {
            public const int PRIMITIVE = 2500;
            public const int PLANE = 2501;
            public const int QUAD = 2502;
            public const int MESH = 2503;
            public const int TEXT = 2504;
            public const int SHAPE = 2505;
            public const int LINE = 2506;
            public class primitive
            {
                public const int PRIMITIVE_CUBE = 2100;
                public const int PRIMITIVE_SPHERE = 2101;
                public const int PRIMITIVE_CAPSULE = 2102;
                public const int PRIMITIVE_CYLINDER = 2103;
            }
        }
    }
    public class Modifier
    {
        public const int APPLY = 8000;
        public const int UPDATE = 8001;
        public const int REMOVE = 8002;
        public const int COMMIT = 8003;
        public class types
        {
            public const int ARRAY = 8100;
            public const int SCALE = 8101;
            public const int TRANSLATE = 8102;
            public const int ROTATE = 8103;
            public const int COLOR = 8104;
            public const int TEXTURE = 8104;
            public const int SHADER = 8104;
        }
    }

    public class Editor
    {
        public const int TOGGLE_BACKDROP = 10000;
    }

    public class Project
    {
        public const int CREATE = 3000;
        public const int DELETE = 3001;
        public const int UPDATE = 3002;
        public const int SET_ACTIVE = 3003;
        public const int SHARE = 3004;
        public const int UNSHARE = 3005;
        public const int ATTACH_BUBBLE = 3006;
        public const int FIND = 3007;
        public const int FIND_ONE = 3008;
        public const int GET_ACTIVE = 3009;
        internal static int MIN = 3000;
        internal static int MAX = 3999;
    }
    public class Bubbles
    {
        public const int CREATE = 4000;
        public const int DELETE = 4001;
        public const int UPDATE = 4002;
        public const int SET_ACTIVE = 4003;
        public const int ADD_DROPLET = 4004;
        public const int DEFINE_STATE = 4005;
        public const int REMOVE_STATE = 4006;
        public const int GET = 4007;
        public const int GET_ALL = 4008;
        public class type
        {
            public const int ENVIRONMENT = 4500;
            public const int MARKER = 4501;
            public const int USER = 4502;
            public const int AMBIENT = 4503;
            public const int ANNOTATION = 4504;
        }
    }
    public class States
    {
        public const int UPDATE = 4002;
        public const int DELETE = 4001;
        public const int SET_ACTIVE = 4003;
        public const int GET = 4007;
        public const int GET_ALL = 4008;
        public const int TRANSITION = 5009;
        public const int ASSOCIATE_FLOW_OBJECT = 5010;
        public const int DISASSOCIATE_FLOW_OBJECt = 5011;
    }

    public class User
    {
        public const int LOGIN = 10002;
    }
    public const int REGISTER_CLIENT = 0;
    public const int LOGIN = 2;
    public const int MAKE_MASTER = 3;
    public const int CONNECTION_REESTABLISHED = 4;
    public const int ERROR = 5;
    public const int NEW_CLIENT = 6;
    public const int LOGGING_IN = 7;
    public const int GET_USERS = 8;
    public const int PING = 9;
    public const int CLIENT_DISCONNECT = 10;
    public const int PONG = 11;
    public const int SET_BACKDROP = 1101;
}
