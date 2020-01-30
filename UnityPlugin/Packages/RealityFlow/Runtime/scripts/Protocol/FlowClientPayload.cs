using System;
using System.Collections.Generic;

namespace RealityFlow.Plugin.Scripts
{
    [System.Serializable]
    public class FlowClientPayload : FlowPayload
    {
        public new FlowClient data;
    }
}