using UnityEngine;

[System.Serializable]
public class FlowClient
{
    public string _id;
    public string uid;
    public string activeConnecitonId;
    public FlowDevice device;
    public int type;
    public int state;
    [System.NonSerialized]
    public const int CLIENT_EDITOR = 0;
    [System.NonSerialized]
    public const int CLIENT_WEB = 1;
    [System.NonSerialized]
    public const int CLIENT_RIPPLE = 2;
    [System.NonSerialized]
    public const int CLIENT_HOLOLENS = 3;
}
