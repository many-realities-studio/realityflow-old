using System.Collections;
using System.Collections.Generic;
using RealityFlow.Plugin.Contrib;
using UnityEngine;
using UnityEngine.UI;

public class NodePortView : MonoBehaviour
{
    public Text fieldName;
    public Text currentNodeGUID;
    public NodePort port;
    // Start is called before the first frame update
    void Start()
    {

    }

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

    public void Init(NodePort np)
    {
        port = np;
        RebuildUI();
    }
}