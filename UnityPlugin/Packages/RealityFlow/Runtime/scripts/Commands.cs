namespace RealityFlow.Plugin.Scripts
{
    public class Commands
    {

        public class FlowObject
        {
            public const int CREATE = 2000;
            public const int DELETE = 2002;
            public const int UPDATE = 2001;
        }

        public class User
        {
            public const int CREATE = 10000;
            public const int UPDATE = 10001;
            public const int LOGIN = 10002;
            public const int LOGOUT = 10003;
            public const int FIND = 10004;
            public const int DELETE = 10005;
        }

        public class Scene
        {
            public const int CREATE = 4000;
            public const int UPDATE = 4001;
            public const int DELETE = 4002;
        }

        public class Project
        {
            public const int CREATE = 3000;
            public const int DELETE = 3009;
            public const int UPDATE = 3002;
            public const int FETCH = 3003;
            public const int INVITE = 3005;
            public const int OPEN = 3007;
            public const int SET_ACTIVE = 3001;
            public const int FIND_ONE = 3008;
            internal static int MIN = 2999;
            internal static int MAX = 3999;
        }

        public class Client
        {
            public const int REGISTER_CLIENT = 5000;
            public const int LOGIN = 5001;
            public const int MAKE_MASTER = 3;
            public const int CONNECTION_REESTABLISHED = 4;
            public const int NEW_CLIENT = 6;
            public const int LOGGING_IN = 7;
            public const int CLIENT_DISCONNECT = 10;
            public const int GET_CLIENTS = 13;
            public const int DELETE_CLIENT = 100;
        }
    }
}
