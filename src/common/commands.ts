export class Commands {

    public static request = class{
        public static object = 1;
        public static project = 2;
        public static scene = 3;
        public static user = 4;
        public static client = 5;
        public static interaction = 6;
    }

    public static action = class{
        public static CREATE = 1;
        public static FETCH = 2;
        public static UPDATE = 3;
        public static DELETE = 4;
        // not yet implemented
        public static FETCH_LIST = 5;

        // user-specific
        public static LOGIN = 6;
        public static LOGOUT = 7;

        // project-specific
        
        // not yet implemented 
        public static ADD_USER = 8;
        
    }
    
    public static commented = {
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
    }

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
