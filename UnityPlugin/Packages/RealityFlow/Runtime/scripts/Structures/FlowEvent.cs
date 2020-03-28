using System;
using UnityEngine;

namespace RealityFlow.Plugin.Scripts
{
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

        public virtual void Send(WebSocket w) { }

        public virtual void Send(WebSocket w, FlowEvent evt)
        {
            timestamp = DateTime.UtcNow.Ticks;
            string stringCmd = JsonUtility.ToJson(evt);

            if (FlowNetworkManager.debug)
                Debug.Log(stringCmd);

            w.SendString(stringCmd);
        }

    }
}
