using System;
using System.Collections.Generic;

namespace RealityFlow.Plugin.Scripts
{
    [System.Serializable]
    public class FlowPayload
    {
        public string data;
        public string _from;
        public FlowPayload()
        {

        }
        public FlowPayload(string _data)
        {
            data = _data;
        }
    }
}