using System.Collections;
using System.Collections.Generic;
using GraphProcessor;
using UnityEngine;
using UnityEngine.UI;

public class NodePortView : MonoBehaviour
{
    public Text fieldName;
    public Text currentNodeGUID;
    public NodePort port;
    public EdgeListener listener;
    public string type;

    void RebuildUI(){
        fieldName.text = port.fieldName;
        string inputGUID, outputGUID;
        if(port.GetEdges().Count > 0) {
            inputGUID = ((BaseNode)port.GetEdges()[0].inputNode).GUID;
            outputGUID = ((BaseNode)port.GetEdges()[0].outputNode).GUID;
            if (inputGUID != port.owner.GUID)
            {
                currentNodeGUID.text = inputGUID.Substring(inputGUID.Length - 5);
            }
            if (outputGUID != port.owner.GUID)
            {
                currentNodeGUID.text = outputGUID.Substring(outputGUID.Length - 5);
            }
        }
    }

    public void SelectEdge(){
        Debug.Log("Selected port of type" + this.port.owner.name);
        switch (type)
        {
            case "input":
                listener.SelectInputPort(this);
                break;
            case "output":
                listener.SelectOutputPort(this);
                break;
        }

    }

    public void Init(NodePort np)
    {
        port = np;
        RebuildUI();
    }
}