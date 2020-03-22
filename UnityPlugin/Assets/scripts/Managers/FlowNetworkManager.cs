using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using System;
using UnityEngine.UI;
using System.Runtime.InteropServices;
using Assets.RealityFlow.Scripts.Events;

/// <summary>
/// Establishes a connection to the Flow server through websocket connections and handles high-level communication
/// </summary>
// [ExecuteInEditMode]
public class FlowNetworkManager : MonoBehaviour
{
    string LOCAL_SERVER = "ws://localhost:8999";
    string LAN_SERVER = "ws://192.168.1.246:8082";
    string REMOTE_SERVER = "ws://plato.mrl.ai:8999";

    public bool LocalServer;
    public static bool debug = true;
    public bool _debug;
    public GameObject mainGameCamera;
    public static String reply;
    public static String username;

    //is this necessary?
    public static FlowNetworkManager instance;
    public static FlowProject testProject;
    private static bool connected = false;
    public static int uid = 3;
    public static bool connection_established = false;

    bool loggedIn = false;
    bool AR_Enabled = true;

    WebSocket w;


    //client constants - potentially unnecessary
    public const int CLIENT_EDITOR = 0;
    public const int CLIENT_WEB = 1;
    public const int CLIENT_RIPPLE = 2;
    public const int CLIENT_HOLOLENS = 3;

    #if UNITY_EDITOR || UNITY_WSA || UNITY_ANDROID || UNITY_IOS

        public static int GetUID()
        {
            return 3;
        }
        public static int GetUserID()
        {
            return uid;
        }

        public static void SendString(string s)
        {
            Debug.Log(s);
        }

        public static string GetUsername()
        {
            return username;
        }
    #endif  


    //for clients that are not the unity editor  and that are the webGL??? WHAT THE HELL 
    #if !UNITY_EDITOR && UNITY_WEBGL
        // imports the dll to use the functions from each library
        [DllImport("__Internal")]
        public static extern string GetUsername();

        [DllImport("__Internal")]
        public static extern void SendTransform(float x, float y, float z);
        
        [DllImport("__Internal")]
        public static extern void SendString(string s);

        [DllImport("__Internal")]
        private static extern int GetUID();

    #endif

    #if UNITY_EDITOR
        public static int clientType = 0;
        private IEnumerator onLoggedInCoroutine;
    #elif UNITY_WEBGL && !UNITY_EDITOR
        public static int clientType = 1;
    #elif UNITY_IOS || UNITY_ANDROID && !UNITY_EDITOR
        public static int clientType = 2;
    #elif UNITY_WSA && !UNITY_EDITOR
        public static int clientType = 3;
    #endif

    IEnumerator ReconnectWebsocket()
    {
        yield return new WaitForSeconds(5);
        yield return StartCoroutine(w.Connect());
        Debug.Log("Connected Websocket!");
    }

    public void Start()
    {
        _debug = debug;
        testProject = new FlowProject();
        testProject.initialize();

        CommandProcessor.initializeRecieveEvents();

        string username = "test";
        string password = "test";

        //UserRegisterEvent register = new UserRegisterEvent();
        //register.Send(username, password, FlowClient.CLIENT_HOLOLENS);

        //UserLoginEvent login = new UserLoginEvent();
        //login.Send(username, password);

        //ProjectCreateEvent createProj = new ProjectCreateEvent();
        //createProj.Send("Subarus Maids2" + DateTime.Now.ToString());

        //ProjectFetchEvent fetchproj = new ProjectFetchEvent();
        //fetchproj.Send();



        #if !UNITY_EDITOR && UNITY_WEBGL
            WebGLInput.captureAllKeyboardInput = false;
        #endif

        username = GetUsername();
        uid = GetUID();

        Application.runInBackground = true;
        if (clientType == CLIENT_EDITOR)
        {
            // Enable Vuforia
            mainGameCamera.SetActive(true);
          // VectorLine.SetCamera3D(FlowCameras.mainCamera);

          // if (login != null)
          // login.fetch_account_id = true;
          //  WULogin.onLoggedIn += OnLoggedIn;
        }
        else if (clientType == CLIENT_WEB)
        {
            FlowCameras.mainCamera = mainGameCamera.GetComponent<Camera>();
            //login.gameObject.SetActive(false);
            string loginName = GetUsername();
        }
        else if (clientType == CLIENT_HOLOLENS)
        {
            Debug.Log("HOLOLENS!");
            mainGameCamera.SetActive(true);
            //mainGameCamera.GetComponent<Camera>().enabled = false;
            //mainGameCamera.tag = "MainCamera";

            //login.gameObject.SetActive(false);
            string loginName = GetUsername();
            #if UNITY_WSA
                eventSystem.AddComponent<UnityEngine.EventSystems.HoloLensInputModule>();
            #endif
        }

        if (LocalServer)
        {
            if ((clientType != CLIENT_RIPPLE && clientType != CLIENT_HOLOLENS) || (DebugPanel.instance.forceHolo))
            {
                w = new WebSocket(new Uri(LOCAL_SERVER));
                Debug.Log("[unity] Connecting to " + LOCAL_SERVER);
            }
            else
            {
                Debug.Log("[unity] Connecting to " + LAN_SERVER);
                w = new WebSocket(new Uri(LAN_SERVER));
            }
        }
        else
        {
            Debug.Log("[unity] Connecting Websocket " + REMOTE_SERVER);
            w = new WebSocket(new Uri(REMOTE_SERVER));
        }

        Debug.Log("Going to Websocket Connection...");

        DoOnMainThread.ExecuteOnMainThread.Enqueue(() =>
        {
            StartCoroutine(ConnectWebsocket());
        });
        Debug.Log("Sent Connection Request");
    }

    IEnumerator ConnectWebsocket()
    {
        Debug.Log("Connecting...");
        yield return StartCoroutine(w.Connect());
        Debug.Log("Connecting...2");
        while (w.error == "Closed")
        {
            yield return StartCoroutine(ReconnectWebsocket());
            Debug.Log("Closed connection");
        }
        
        connected = true;
        FlowNetworkManager.connection_established = true;
        Debug.Log("[unity] Connected!");

        //used to be a switch case but the methods called all did the same thing 
        OnLoggedIn();
        Debug.Log("CONNECTED WEBSOCKET");


        // recieve updates from the server (currently not working)  
        // essentially run forever   
        while (true)
        {
            //reply grabs information from the websocket
            reply = w.RecvString();
            //returns in json form the flow event
            //Debug.Log("Updates from Server: " + reply);
            if (reply != null && reply != "Null")
            {
                //incoming
                Debug.Log("Processing Command - Phil");
                //creates a flow event from the json of the reply
                FlowEvent incoming = JsonUtility.FromJson<FlowEvent>(reply);
                //sends the flow event to be processed by the command processor
                CommandProcessor.processCommand(incoming);
            }
            if (w.error != null)
            {
                Debug.Log("[unity] Error: " + w.error);
                connected = false;

                yield return new WaitForSeconds(5);
                #if !UNITY_WSA || UNITY_EDITOR
                    DoOnMainThread.ExecuteOnMainThread.Enqueue(() =>
                    {
                        StartCoroutine(ConnectWebsocket());
                    });

                    Debug.Log("Connect connection");
                    CommandProcessor.sendCommand(Commands.User.LOGIN, uid.ToString());
                    loggedIn = false;
                #endif
            }
            yield return 0;
        }
     }

    void OnWebLoggedIn()
    {
        Debug.Log("[unity] Logged in");
        DebugPanel.instance.clientIdentityValue.GetComponent<Text>().text = uid + " " + GetUsername();
        loggedIn = true;
        CommandProcessor.sendCommand(Commands.User.LOGIN, uid.ToString());
    }

    void OnLoggedIn()
    {
        Debug.Log("LoggedIn");
        //DebugPanel.instance.clientIdentityValue.GetComponent<Text>().text = uid + " " + GetUsername();
        loggedIn = true;
        CommandProcessor.sendCommand(Commands.User.LOGIN, uid.ToString());
    }

    /// <summary>
    /// Update is called every frame, if the MonoBehaviour is enabled. sends commands through the websocket
    /// </summary>
    /// 
    public void Update()
    {
        debug = _debug;

        // Start with delete key.
        if (Input.GetKeyDown(KeyCode.Delete))
        {
            Debug.Log("Deleting!!!");
            // Send Delete Commands
        }
        // send commands back to the server
        if (CommandProcessor.cmdBuffer.Count > 0 && connected)
        {
            // Debug.Log("Sending command!");
            foreach (FlowEvent cmd in CommandProcessor.cmdBuffer)
            {
                // Debug.Log(JsonUtility.ToJson(cmd));
                cmd.Send(w);
            }
            CommandProcessor.cmdBuffer.Clear();
        }
    }


    /// <summary>
    /// Send through Edit commands - not being used currently 
    /// </summary>
    public void ProcessEditCommand ()
    {
        reply = w.RecvString();
        if (reply != null && reply != "Null")
        {
            Debug.Log("Processing Command1");
            FlowEvent incoming = JsonUtility.FromJson<FlowEvent>(reply);
            if (incoming.command >= Commands.Project.MIN && incoming.command <= Commands.Project.MAX)
            {
                CommandProcessor.processProjectCommand(JsonUtility.FromJson<FlowProjectCommand>(reply));
            }
            else
            {
                CommandProcessor.processCommand(incoming);
            }
        }
    }


}