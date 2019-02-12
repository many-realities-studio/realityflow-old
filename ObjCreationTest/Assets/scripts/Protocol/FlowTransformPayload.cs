using System;
using System.Collections.Generic;

[System.Serializable]
public class FlowTransformPayload : FlowPayload
{
    public new FlowTransform data;
    public FlowTransformPayload(FlowTransform init) {
        data = init;
    }
    public FlowTransformPayload(string _tid) {
        data = new FlowTransform(_tid);
    }
}
