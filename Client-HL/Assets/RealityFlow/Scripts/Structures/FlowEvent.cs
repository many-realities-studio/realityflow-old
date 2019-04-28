using System;
using UnityEngine;

[System.Serializable]
public class FlowEvent
{
    public int command;
    public int _id;
    public long timestamp;
    public string project_id;
    public string client_id;

    public virtual void Send( WebSocket w ){}

    public virtual void Send( WebSocket w, FlowEvent evt) {
        timestamp = DateTime.UtcNow.Ticks;
        string stringCmd = JsonUtility.ToJson(evt);

        FlowNetworkManager.log("Sending " + stringCmd);

        try
        {
            w.SendString(stringCmd);
        }
        catch
        {
            FlowNetworkManager.log("The update didnt send, and the websocket connection status is: " + w.connected +
                "\nthe json is: " + stringCmd);
        }

    }

}
