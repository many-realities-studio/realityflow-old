using System;
using System.Collections.Generic;

namespace RealityFlow.Plugin.Scripts
{
    [System.Serializable]
    public class FlowState
    {
        public String _id;
        public String _bid;
        [System.NonSerialized]
        public List<string> _instances;
        public String name;
        public String _parentState;
    }
}