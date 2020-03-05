using System;
using System.Collections.Generic;

namespace RealityFlow.Plugin.Scripts
{
    [System.Serializable]
    public class FlowDevicePayload : FlowPayload
    {
        public new FlowDevice data;
        public int type;
        public FlowDevicePayload(FlowDevice payload)
        {
            data = payload;
            type = FlowNetworkManager.clientType;
        }
    }
}