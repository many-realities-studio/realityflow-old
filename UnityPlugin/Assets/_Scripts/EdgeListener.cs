using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using GraphProcessor;


/* This class is a refactor of EdgeConnectorListener from NGP.
   Unlike the other class this is designed to work with VR inputs instead of the UnityEditor */
public class EdgeListener : MonoBehaviour
{
    public RealityFlowGraphView graphView;

    // TODO: add dictionary or list to create edges
    NodePort input, output;

    // Constructor
    public EdgeListener(RealityFlowGraphView graphView)
    {
        this.graphView = graphView;
    }

    public void AddEdgeToGraph(){
        graphView.graph.Connect (input, output);
    }

    public void SelectInputPort(NodePortView input){
        this.input = input.port;
        Debug.Log(input.port.portData);
        CheckForConnection();
    }

    public void SelectOutputPort(NodePortView output){
        this.output = output.port;        
        CheckForConnection();
    }

    private void CheckForConnection(){
        // TODO: We need to make sure this is a valid connection (get the port types and make sure they can be connected)
        if ( input != null && output != null){
            Debug.Log("Both ports are filled");
            // TODO: Update this, this only takes in the type of the node and not necessarily a type that can be cast to this node
            if (this.input.owner.name == this.output.owner.name)
                graphView.ConnectEdges(input, output);
            else
                Debug.Log("The types of ports are not connectable");
        }
    }

}
