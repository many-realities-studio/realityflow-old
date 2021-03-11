using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using RealityFlow.Plugin.Contrib;


/* This class is a refactor of EdgeConnectorListener from NGP.
   Unlike the other class this is designed to work with VR inputs instead of the UnityEditor */
public class EdgeListener : MonoBehaviour
{
    protected readonly RealityFlowGraphView graphView;

    // TODO: add dictionary or list to create edges
    NodePort input, output;

    // Constructor
    public EdgeListener(RealityFlowGraphView graphView)
    {
        this.graphView = graphView;
    }


    public void SelectInputPort(NodePort input){
        this.input = input;
        Debug.Log(input.portData);
    }

    public void SelectOutputPort(NodePort output){
        this.output = output;        
    }

    private void CheckForConnection(){

    }

}
