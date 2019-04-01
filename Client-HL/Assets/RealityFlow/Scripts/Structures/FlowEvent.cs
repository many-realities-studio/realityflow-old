using System;
using UnityEngine;

/// <summary>
/// 
/// </summary>
[System.Serializable]
public class FlowEvent
{
    public int cmd;
    public FlowPayload value;
    public long timestamp;

    public virtual void Send( WebSocket w ){}

    public virtual void Send( WebSocket w, FlowEvent evt) {
        timestamp = DateTime.UtcNow.Ticks;
        string stringCmd = JsonUtility.ToJson(evt);

        if(FlowNetworkManager.debug)
            Debug.Log(stringCmd);

        w.SendString(stringCmd);
    }

}
