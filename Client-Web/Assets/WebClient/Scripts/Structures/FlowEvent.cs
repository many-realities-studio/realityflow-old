using System;
using UnityEngine;

/// <summary>
/// 
/// </summary>
[System.Serializable]
public class FlowEvent
{
    public int command;
    public FlowPayload value;
    public long timestamp;
    public string project_id;
    public string client_id;

    public virtual void Send( WebSocket w ){}

    public virtual void Send( WebSocket w, FlowEvent evt) {
        timestamp = DateTime.UtcNow.Ticks;
        string stringCmd = JsonUtility.ToJson(evt);

        if(FlowNetworkManager.debug)
            Debug.Log(stringCmd);

        try
        {
            w.SendString(stringCmd);
        }
        catch
        {
            Debug.Log("The update didnt send, and the websocket connection status is: " + w.connected);
            Debug.Log("the json is: " + stringCmd);
        }

        Debug.Log("Sent successfully! Json: " + stringCmd);
    }

}
