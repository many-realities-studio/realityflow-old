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
    // used to access non-static properties such as the debug attribute
    public static FlowNetworkManager instance;

    // debug logs are only created if this is turned on. This can be done in the unity gui
    public bool debug;

    public bool LocalServer = false;

    public GameObject mainGameCamera;
    public static string reply;
    public static bool connected = false;

    public static FlowProject testProject;
    bool registered = false;

    WebSocket w;
    IEnumerator coroutine;

#if UNITY_EDITOR
    public static int clientType = CLIENT_EDITOR;
    private IEnumerator onLoggedInCoroutine;
#endif

    #region assign server urls

    string LOCAL_SERVER = "ws://localhost:8999";
    string LAN_SERVER = "ws://192.168.1.246:8082";
    string REMOTE_SERVER = "ws://plato.mrl.ai:8999";

    #endregion

    #region instantiate client constants

    public const int CLIENT_EDITOR = 0;
    public const int CLIENT_WEB = 1;
    public const int CLIENT_RIPPLE = 2;
    public const int CLIENT_HOLOLENS = 3;

    private const int ERROR_NO_CLIENT_FOUND = 0;

    #endregion

    // hard coded login info. This can be configured from the unity gui and should be removed once a login system is added to the HL-Client
    public string username;
    public string password;

    // hard coded project id. This can be configured from the unity gui and should be removed once a project selection system is added to the HL-Client
    public string project_name;

    // Hard coded login. This should be removed when a login system is added to the HL-Client
    public void login()
    {
        UserLoginEvent login = new UserLoginEvent();
        login.Send(username, password, FlowClient.CLIENT_HOLOLENS);
    }

    // Hard coded project load. This should be removed when a project selection system is added to the HL-Client
    public void loadProject()
    {
        foreach (FlowProject project in Config.projectList)
            if (project.projectName == project_name)
                Config.projectId = project._id;

        ProjectFetchEvent fetchproj = new ProjectFetchEvent();
        fetchproj.Send();

        registered = true;
    }

    /* This function locates objects that are removed by the the holotoolkits' appbar and sends delete updates to the server */
    public void locateObjectsToDelete()
    {
        foreach (string id in FlowProject.activeProject.transformsById.Keys)
            if (FlowProject.activeProject.transformsById[id].transform == null)
            {
                ObjectDeleteEvent deleteObject = new ObjectDeleteEvent();
                deleteObject.Send(id);
                FlowProject.activeProject.transformsById.Remove(id);
            }
    }

    public void Awake()
    {
        log("Setting main camera " +  clientType);
        
        if (mainGameCamera == null)
        {
            GameObject cam = GameObject.FindGameObjectWithTag("MainCamera");
            FlowCameras.mainCamera = cam.GetComponent<Camera>();
        }
        else
        {
            FlowCameras.mainCamera = mainGameCamera.GetComponent<Camera>();
        }
    }

    IEnumerator ConnectWebsocket()
    {
        log("Connecting...");
        yield return StartCoroutine(w.Connect());
        log("Connecting...2");
        while (w.error == "Closed")
        {
            yield return StartCoroutine(ReconnectWebsocket());
            log("Closed connection");
        }
        
        connected = true;
        log("CONNECTED WEBSOCKET");

        while (true)
        {
            reply = w.RecvString();
            if (reply != null && reply != "Null")
            {
                FlowEvent incoming = JsonUtility.FromJson<FlowEvent>(reply);
                CommandProcessor.processCommand(incoming);
            }
            if (w.error != null)
            {
                log("[unity] Error: " + w.error);
                connected = false;

                yield return new WaitForSeconds(5);
#if !UNITY_WSA
                DoOnMainThread.ExecuteOnMainThread.Enqueue(() =>
                {
                    StartCoroutine(ConnectWebsocket());
                });
#endif
            }
            yield return 0;
        }
     } 
    IEnumerator ReconnectWebsocket()
    {
        yield return new WaitForSeconds(5);
        yield return StartCoroutine(w.Connect());
        log("Connected Websocket!");
    }

    public void Start()
    {
        instance = this;
        testProject = new FlowProject();
        testProject.initialize();

        // loads receive functions into command processor dictionary 
        if(CommandProcessor.receiveEvents.Count == 0)
            CommandProcessor.initializeRecieveEvents();

        login();

        if (LocalServer)
        {
            if ((clientType != CLIENT_RIPPLE && clientType != CLIENT_HOLOLENS) || (DebugPanel.instance.forceHolo))
            {
                log("[unity] Connecting to " + LOCAL_SERVER);
                w = new WebSocket(new Uri(LOCAL_SERVER));
            }
            else
            {
                log("[unity] Connecting to " + LAN_SERVER);
                w = new WebSocket(new Uri(LAN_SERVER));
            }
        }
        else
        {
            log("[unity] Connecting Websocket " + REMOTE_SERVER);
            w = new WebSocket(new Uri(REMOTE_SERVER));
        }

        log("Going to Websocket Connection...");

        DoOnMainThread.ExecuteOnMainThread.Enqueue(() =>
        {
            StartCoroutine(ConnectWebsocket());
        });

        log("Sent Connection Request");
    }
    public void Update()
    {
        if (Config.loggedIn && !registered)
            loadProject();

        if (FlowProject.activeProject != null && FlowProject.activeProject.transformsById != null)
            locateObjectsToDelete();
            
        // sends any commands that have been queued 
        if (CommandProcessor.cmdBuffer.Count > 0 && connected)
        {
            foreach (FlowEvent cmd in CommandProcessor.cmdBuffer)
                cmd.Send(w);
            CommandProcessor.cmdBuffer.Clear();
        }
    }

    //  To be used in place of Debug.log. This function checks the debug paremeter before logging
    public static void log(string log)
    {
        if (instance != null && instance.debug)
            Debug.Log(log);
    }

    // Run on exit of application. Logs the user out of the server and closes the websocket
    public void OnApplicationQuit()
    {
        UserLogoutEvent logout = new UserLogoutEvent();
        logout.Send();

        log("Closing!!");
        if(w != null && w.connected )
        w.Close();
    }
}