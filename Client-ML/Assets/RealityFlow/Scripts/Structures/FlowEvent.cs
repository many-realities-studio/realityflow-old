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

    public virtual void Send( WebSocket w) {
        string stringCmd = JsonUtility.ToJson(this);
        //Debug.Log(stringCmd);
        w.SendString(stringCmd);
    }
}
