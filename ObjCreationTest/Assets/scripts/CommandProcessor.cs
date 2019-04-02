using UnityEngine;
using UnityEngine.UI;
using System;
using System.Collections;
using System.Collections.Generic;


[System.Serializable]
public class FlowClientCommand : FlowEvent
{
    public new FlowClientPayload value;
}

[System.Serializable]
public class FlowDeviceCommand : FlowEvent
{
    public new FlowDevicePayload value;
    public FlowDeviceCommand(FlowDevice devicePayload)
    {
        value = new FlowDevicePayload(devicePayload);
    }
    public override void Send(WebSocket w)
    {
        timestamp = System.DateTime.UtcNow.Ticks;
        string stringCmd = JsonUtility.ToJson(this);
        //Debug.Log("FlowTransformCommand: " + stringCmd);
        w.SendString(stringCmd);
    }
}
[System.Serializable]
public class FlowProjectCommand : FlowEvent
{
    public new FlowProjectPayload value;
}

[System.Serializable]
public class FlowTransformCommand : FlowEvent
{
    public FlowTransformCommand() {
        this.cmd = Commands.Transform.UPDATE;
    }
    public FlowTransform transform;
    public override void Send(WebSocket w)
    {
        timestamp = System.DateTime.UtcNow.Ticks;
        string stringCmd = JsonUtility.ToJson(this);
        w.SendString(stringCmd);
    }

    public void Copy(FlowTransformCommand arg)
    {
        arg.cmd = this.cmd;
        arg.transform = this.transform;
        arg.value = this.value;
    }
}

public class FlowLoginCommand : FlowEvent
{
    public FlowLoginCommand()
    {
        this.cmd = Commands.User.LOGIN;
    }

    public User user;
    public FlowClient client;
    public FlowProject[] project;

    public override void Send(WebSocket w)
    {
        timestamp = System.DateTime.UtcNow.Ticks;
        string stringCmd = JsonUtility.ToJson(this);
        Debug.Log(stringCmd);
        w.SendString(stringCmd);
    }
}

public class CreateFlowObjectCommand : FlowEvent
{
    public CreateFlowObjectCommand() {
        this.cmd = Commands.FlowObject.CREATE;
    }
    public jsonObject obj;
    public override void Send(WebSocket w)
    {
        timestamp = System.DateTime.UtcNow.Ticks;
        string stringCmd = JsonUtility.ToJson(this);
        Debug.Log(stringCmd);
        w.SendString(stringCmd);
    }

    public void Copy(CreateFlowObjectCommand arg)
    {
        arg.cmd = this.cmd;
        arg.obj = this.obj;
        arg.value = this.value;
    }
}

[System.Serializable]
public class clientRegisterCommand : FlowEvent
{
    public string details;
}

//[ExecuteInEditMode]
public class CommandProcessor
{
    const int PARAMETER_TRANSFORM = 0;
    const int PARAMETER_ROTATION = 1;
    const int PARAMETER_SCALE = 2;
    const int PARAMETER_RECT_TRANSFORM = 3;
    const int PARAMETER_IMAGE = 4;

    private static bool commandToBeSent;
    public static List<FlowEvent> cmdBuffer = new List<FlowEvent>();
    public static Dictionary<int, delegate_flow_cmd> cmdCbDictionary = new Dictionary<int, delegate_flow_cmd>();

    public static Dictionary<int, delegate_flow_project> projectCbDictionary = new Dictionary<int, delegate_flow_project>();

    private static Dictionary<int, List<delegate_flow_cmd>> listenerCmdDictionary = new Dictionary<int, List<delegate_flow_cmd>>();
   private static Dictionary<int, List<delegate_flow_project>> listenerProjectDictionary = new Dictionary<int, List<delegate_flow_project>>();
    
    public delegate void delegate_flow_project(FlowProjectCommand project);

    public delegate void delegate_flow_cmd(FlowEvent cmd);
    public delegate void delegate_FlowTransform(FlowTransformCommand cmd);

    public static int counter = 0;
    public static void processProjectCommand(FlowProjectCommand incoming)
    {
        if (projectCbDictionary.ContainsKey(incoming.cmd))
        {
            delegate_flow_project cb;
            bool result = projectCbDictionary.TryGetValue(incoming.cmd, out cb);
            if (result)
            {
                cb(incoming);
            }
        }
        if (listenerProjectDictionary.ContainsKey(incoming.cmd))
        {
            List<delegate_flow_project> callbacks;
            listenerProjectDictionary.TryGetValue(incoming.cmd, out callbacks);
            foreach (delegate_flow_project cb in callbacks)
            {
                cb(incoming);
            }
        }
    }
    public static int processCommand(FlowEvent incoming)
    {
        int retValue = 0;
        if (cmdCbDictionary.ContainsKey(incoming.cmd))
        {
            delegate_flow_cmd cb;
            cmdCbDictionary.TryGetValue(incoming.cmd, out cb);
            cb(incoming);
            cmdCbDictionary.Remove(incoming.cmd);
        }
        if (listenerCmdDictionary.ContainsKey(incoming.cmd))
        {
            List<delegate_flow_cmd> callbacks;
            listenerCmdDictionary.TryGetValue(incoming.cmd, out callbacks);
            foreach (delegate_flow_cmd cb in callbacks)
            {
                cb(incoming);
            }
        }
        switch (incoming.cmd)
        {
            case Commands.LOGIN:
                // Successful login

#if !UNITY_WEBGL || UNITY_EDITOR
                // Debug.Log("[unity] Success in logging in!" + incoming.value + PlayerPrefs.HasKey("client_id") + PlayerPrefs.GetString("client_id"));
                if ((!(DebugPanel.instance.forceHolo || DebugPanel.instance.forceWeb) && !(PlayerPrefs.HasKey("client_id") && PlayerPrefs.GetString("client_id") != "")) ||
                    (DebugPanel.instance.forceHolo && !(PlayerPrefs.HasKey("holo_client_id") && PlayerPrefs.GetString("holo_client_id") != "")) ||
                    (DebugPanel.instance.forceWeb && !(PlayerPrefs.HasKey("web_client_id") && PlayerPrefs.GetString("web_client_id") != "")) &&
                    !FlowNetworkManager.connection_established)
                {
                    FlowDeviceCommand register = new FlowDeviceCommand(new FlowDevice());
                    sendCommand(register);
                }
                else
                {
                    if (DebugPanel.instance.forceWeb)
                    {
                        FlowNetworkManager.identity_value = PlayerPrefs.GetString("web_client_id");
                    }
                    else if (DebugPanel.instance.forceHolo)
                    {
                        Debug.Log("Forcing as hololens");
                        FlowNetworkManager.identity_value = PlayerPrefs.GetString("holo_client_id");
                    }
                    else
                    {
                        FlowNetworkManager.identity_value = PlayerPrefs.GetString("client_id");
                    }
                    sendCommand(Commands.CONNECTION_REESTABLISHED, FlowNetworkManager.identity_value);
                }
#endif
                break;
            case Commands.LOGGING_IN:
                //Debug.Log("[unity] Getting status of logging in from client");
                break;
            case Commands.REGISTER_CLIENT:
                // Notify the enclosing web page about the status
                FlowClientCommand incomingCmd = JsonUtility.FromJson<FlowClientCommand>(FlowNetworkManager.reply);
                FlowNetworkManager.identity_value = incomingCmd.value.data._id;
#if !UNITY_WEBGL || UNITY_EDITOR
                if (DebugPanel.instance.forceHolo)
                {
                    PlayerPrefs.SetString("holo_client_id", FlowNetworkManager.identity_value);
                }
                else if (DebugPanel.instance.forceWeb)
                {
                    PlayerPrefs.SetString("web_client_id", FlowNetworkManager.identity_value);
                }
                else
                    PlayerPrefs.SetString("client_id", FlowNetworkManager.identity_value);
#endif
                switch (FlowNetworkManager.clientType)
                {
                    case FlowClient.CLIENT_EDITOR:
                        DebugPanel.instance.identity.text = "Edit(" + FlowNetworkManager.identity_value.Substring(FlowNetworkManager.identity_value.Length - 5, 5) + ")";
                        DebugPanel.instance.HUD_ClientIdentity.text = "Edit(" + FlowNetworkManager.identity_value.Substring(FlowNetworkManager.identity_value.Length - 5, 5) + ")";
                        break;
                    case FlowClient.CLIENT_WEB:
                        DebugPanel.instance.identity.text = "Web(" + FlowNetworkManager.identity_value.Substring(FlowNetworkManager.identity_value.Length - 5, 5) + ")";
                        break;
                    case FlowClient.CLIENT_HOLOLENS:
                        DebugPanel.instance.identity.text = "Holo(" + FlowNetworkManager.identity_value.Substring(FlowNetworkManager.identity_value.Length - 5, 5) + ")";
                        break;
                }
                DebugPanel.instance.client.text = FlowNetworkManager.identity_value.Substring(FlowNetworkManager.identity_value.Length - 5, 5);
                DebugPanel.instance.connectionStatus.text = "Disconnect";
                onRegisteredClient();
                break;
            case Commands.CONNECTION_REESTABLISHED:
                //Debug.Log("[unity] Connection re-established " + incoming.value);
                if (!FlowNetworkManager.connection_established)
                    FlowNetworkManager.connection_established = true;
                DebugPanel.instance.connectionStatus.text = "Disconnect";
#if !UNITY_WEBGL || UNITY_EDITOR
                if (DebugPanel.instance.forceHolo)
                {
                    if (!PlayerPrefs.HasKey("holo_client_id"))
                        PlayerPrefs.SetString("holo_client_id", FlowNetworkManager.identity_value);
                }
                else if (DebugPanel.instance.forceWeb)
                {
                    if (!PlayerPrefs.HasKey("web_client_id"))
                        PlayerPrefs.SetString("web_client_id", FlowNetworkManager.identity_value);
                }
                else
                    if (!PlayerPrefs.HasKey("client_id"))
                    PlayerPrefs.SetString("client_id", FlowNetworkManager.identity_value);
                FlowNetworkManager.identity_value = incoming.value.data;
#elif UNITY_WEBGL
                FlowNetworkManager.identity_value = incoming.value.data;
#endif
                switch (FlowNetworkManager.clientType)
                {
                    case FlowClient.CLIENT_EDITOR:
                        DebugPanel.instance.identity.text = "Edit(" + FlowNetworkManager.identity_value.Substring(FlowNetworkManager.identity_value.Length - 5, 5) + ")";
                        break;
                    case FlowClient.CLIENT_WEB:
                        DebugPanel.instance.identity.text = "Web(" + FlowNetworkManager.identity_value.Substring(FlowNetworkManager.identity_value.Length - 5, 5) + ")";
                        break;
                    case FlowClient.CLIENT_HOLOLENS:
                        DebugPanel.instance.identity.text = "Holo(" + FlowNetworkManager.identity_value.Substring(FlowNetworkManager.identity_value.Length - 5, 5) + ")";
                        break;
                }
                onRegisteredClient();
                break;
            case Commands.ERROR:
#if !UNITY_WEBGL || UNITY_EDITOR
                Debug.Log("[unity] Error" + incoming.value);
                PlayerPrefs.DeleteAll();
                FlowNetworkManager.identity_value = "-1";
                FlowDeviceCommand registercmd = new FlowDeviceCommand(new FlowDevice());
                sendCommand(registercmd);
#endif
                break;
            case Commands.PING:
                sendCommand(Commands.PONG, "0");
                break;
            case Commands.SET_BACKDROP:
                Debug.Log("Setting backdrop");
                Canvas mainCanvas = GameObject.Find("Canvas").GetComponent<Canvas>();
                mainCanvas.gameObject.SetActive(incoming.value.data != "0");
                break;
            case Commands.Transform.UPDATE:
                FlowTransformCommand trans_update_cmd = (FlowTransformCommand)JsonUtility.FromJson<FlowTransformCommand>(FlowNetworkManager.reply);
                FlowTransform transform2 = FlowProject.activeProject.transformsById[trans_update_cmd.transform._id];
                if (trans_update_cmd.transform._id != "0")
                {
                    transform2.Copy(trans_update_cmd.transform);
                    transform2.Update();
                }
                // This Code is only for calibration and assumes pre-decided IDs
                break;
            case Commands.FlowObject.CREATE:
                CreateFlowObjectCommand fe = (CreateFlowObjectCommand)JsonUtility.FromJson<CreateFlowObjectCommand>(FlowNetworkManager.reply);
                jsonObject obj =  fe.obj;
                
                GameObject newObj = GameObject.CreatePrimitive(PrimitiveType.Cube);
                newObj.AddComponent(typeof(FlowObject));

                Mesh objMesh = newObj.GetComponent<MeshFilter>().mesh;
                objMesh.vertices = obj.vertices;
                objMesh.uv = obj.uv;
                objMesh.triangles = obj.triangles;
                objMesh.RecalculateBounds();
                objMesh.RecalculateNormals();
                newObj.transform.localPosition = new Vector3(obj.x, obj.y, obj.z);
                newObj.transform.localRotation = Quaternion.Euler(new Vector4(obj.q_x, obj.q_y, obj.q_z, obj.q_w));
                newObj.transform.localScale = new Vector3(obj.s_x, obj.s_y, obj.s_z);
                MonoBehaviour.Destroy(newObj.GetComponent<Collider>());
                newObj.AddComponent<BoxCollider>();
                // Set the new flowObject as a child of the object manager
                newObj.transform.SetParent(GameObject.FindGameObjectWithTag("ObjManager").transform);
                newObj.name = obj.objectName;
                newObj.AddComponent(typeof(FlowObject));
                newObj.GetComponent<FlowObject>().Start();
                newObj.GetComponent<FlowObject>().ft._id = obj._id;
                newObj.GetComponent<FlowObject>().ft.id = obj.id;
                FlowProject.activeProject.RegObj();
                break;
            case Commands.User.LOGIN:
                FlowLoginCommand log = (FlowLoginCommand)JsonUtility.FromJson<FlowLoginCommand>(FlowNetworkManager.reply);
                Config.userId = log.user.userId;
                Config.deviceId = log.client._id;
                Config.projectList = log.project;
                break;
            default:
                break;
        }
        return retValue;
    }

    public static void sendCommand(FlowEvent evt)
    {
        CommandProcessor.cmdBuffer.Add(evt);
    }

    public static void sendCommand(FlowDeviceCommand cmd)
    {
        CommandProcessor.cmdBuffer.Add(cmd);
    }

    public static void sendCommand(FlowTransformCommand evt)
    {
        CommandProcessor.cmdBuffer.Add(evt);
    }

    public static void sendCommand(int command, string value)
    {
        FlowEvent newCmd = new FlowEvent();
        newCmd.cmd = command;
        newCmd.value = new FlowPayload();
        newCmd.value.data = value;
        CommandProcessor.cmdBuffer.Add(newCmd);
    }


    private static void sendCommand(int command, string value, delegate_flow_cmd callback)
    {
        FlowEvent newCmd = new FlowEvent();
        newCmd.cmd = command;
        newCmd.value.data = value;
        cmdBuffer.Add(newCmd);
        if (cmdCbDictionary.ContainsKey(command))
            cmdCbDictionary.Remove(command);
        cmdCbDictionary.Add(command, callback);
    }

    public static void registerListener(int command, delegate_flow_cmd listener)
    {
        if (listenerCmdDictionary.ContainsKey(command))
        {
            List<delegate_flow_cmd> listeners;
            listenerCmdDictionary.TryGetValue(command, out listeners);
            listeners.Add(listener);
        }
        else
        {
            List<delegate_flow_cmd> listeners = new List<delegate_flow_cmd>();
            listeners.Add(listener);
            listenerCmdDictionary.Add(command, listeners);
        }
    }
    private static void onRegisteredClient()
    {
        //sendCommand(Commands.Project.GET_ACTIVE, "", FlowNetworkManager.setActiveProject);
        // Registering listener for active project changes
        //registerListener(Commands.Project.SET_ACTIVE, FlowNetworkManager.setActiveProject);
    }


}
