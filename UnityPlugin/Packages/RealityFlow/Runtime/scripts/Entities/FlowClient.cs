using UnityEngine;

namespace RealityFlow.Plugin.Scripts
{
    [System.Serializable]
    public class FlowClient : FlowValue
    {
        public string uid;
        public string activeConnecitonId;
        public FlowDevice device;
        public int deviceType;
        public int state;
        [System.NonSerialized]
        public const int CLIENT_EDITOR = 0;
        [System.NonSerialized]
        public const int CLIENT_WEB = 1;
        [System.NonSerialized]
        public const int CLIENT_RIPPLE = 2;
        [System.NonSerialized]
        public const int CLIENT_HOLOLENS = 3;

        public FlowClient()
        {
        }

        public FlowClient(int deviceType)
        {
            this.deviceType = deviceType;
        }

        public FlowClient(string deviceId)
        {
            _id = deviceId;
        }
    }
}
