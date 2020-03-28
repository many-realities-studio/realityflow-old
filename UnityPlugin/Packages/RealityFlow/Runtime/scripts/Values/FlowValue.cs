using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using System.Runtime.Serialization;

namespace RealityFlow.Plugin.Scripts
{
    public interface FlowValue
    {
        [DataMember]
        string FlowId { get; set; }
    }
}