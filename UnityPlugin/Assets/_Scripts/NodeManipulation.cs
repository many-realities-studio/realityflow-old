using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using GraphProcessor;
using UnityEngine.EventSystems;
using Microsoft.MixedReality.Toolkit.Input;

public class NodeManipulation : MonoBehaviour//,IMixedRealityPointerHandler
{
    // Start is called before the first frame update
    Vector3 position;
    Quaternion rotation;
    public static NodeManipulation instance;
    GameObject rfgvGameObject; // realityflowgraphview script
    public RealityFlowGraphView rfgv;
    BaseGraph graph;
    void Awake()
    {
        instance = this;
        position = this.transform.position;
        rotation = this.transform.rotation;
        Physics.IgnoreLayerCollision(3, 3);
    }

    public void NodeRaycastCreation()
    {
        GameObject node = gameObject.transform.GetChild(0).gameObject;
        RaycastHit hit;
        if(Physics.Raycast(node.transform.position, node.transform.TransformDirection(Vector3.forward), out hit, Mathf.Infinity))
        {
            //Debug.DrawRay(node.transform.position, node.transform.TransformDirection(Vector3.forward) * hit.distance, Color.green);
            Debug.Log("Did Hit");
            foreach(GameObject w in ButtonClick.WhiteBoards)
            {
                rfgvGameObject = GameObject.FindGameObjectWithTag("Canvas").transform.GetChild(5).gameObject;
                rfgv = rfgvGameObject.GetComponent<RealityFlowGraphView>();
                graph = rfgv.graph;
                //Debug.Log("rfgv set, game object: "+rfgvGameObject+", rfgv: "+rfgv+", graph: "+rfgv.graph);
            }
            AttachNodeToGraph();
        }
        else
        {
            Destroy(node);
            //Debug.DrawRay(node.transform.position, node.transform.TransformDirection(Vector3.forward) * 1000, Color.red);
            Debug.Log("Did not Hit");
        }
    }

    public void AttachNodeToGraph()
    {
        switch(this.transform.GetChild(0).tag)
        {
            case "TextNode":
                rfgv.AddNodeCommand("TextNode");
                Destroy(this.gameObject);
                break;
            case "FloatNode":
                rfgv.AddNodeCommand("FloatNode");
                Destroy(this.gameObject);
                break;
            case "IntNode":
                rfgv.AddNodeCommand("IntNode");
                Destroy(this.gameObject);
                break;
            case "BoolNode":
                rfgv.AddNodeCommand("BoolNode");
                Destroy(this.gameObject);
                break;
            case "ConditionalNode":
                rfgv.AddNodeCommand("ConditionalNode");
                Destroy(this.gameObject);
                break;
            default:
                Debug.LogError("Invalid Node");
                break;
        }
       
            //rfgv.AddNodeCommand();
            //Destroy(this.gameObject);
    }
    public void RefreshPalette()
    {
        // Once a node is dragged off of the command palette, this will add a new one to take its place immediately
        GameObject o = Instantiate(this.gameObject,position,rotation,this.transform.parent);
        Debug.Log("Node should have been created to refresh the palette, it's name is "+o.name);
    }
}
