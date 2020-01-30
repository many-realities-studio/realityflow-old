using System;
using System.Collections.Generic;

namespace RealityFlow.Plugin.Scripts
{
    [System.Serializable]
    public class FlowProjectPayload : FlowPayload
    {
        public string _id;
        public new FlowProject data;
    }
}
