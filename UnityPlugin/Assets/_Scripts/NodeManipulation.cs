using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using RealityFlow.Plugin.Contrib;
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
        //position = this.transform.position;
        //rotation = this.transform.rotation;
        Physics.IgnoreLayerCollision(3, 3);
    }

    public void NodeRaycastCreation()
    {
        GameObject node = gameObject.transform.GetChild(0).gameObject;
        RaycastHit hit;
        if(Physics.Raycast(node.transform.position, 
        node.transform.TransformDirection(Vector3.forward), 
        out hit, Mathf.Infinity,1<<6))
        {
            //Debug.DrawRay(node.transform.position, node.transform.TransformDirection(Vector3.forward) * hit.distance, Color.green);
            Debug.Log("Did Hit");
            //rfgvGameObject = GameObject.FindGameObjectWithTag("Canvas").transform.GetChild(5).gameObject;
            rfgvGameObject = hit.collider.gameObject.transform.GetChild(5).gameObject;
            Debug.Log("rfgv object name is "+rfgvGameObject.name);
            rfgv = rfgvGameObject.GetComponent<RealityFlowGraphView>();
            graph = rfgv.graph;
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
        rfgv.AddNodeCommand(this.transform.GetChild(0).tag);
        Destroy(this.gameObject);
    }
    public void RefreshPalette()
    {
        // Once a node is dragged off of the command palette, this will add a new one to take its place immediately
        GameObject o = Instantiate(this.gameObject,this.transform.position,this.transform.rotation,this.transform.parent);
        Debug.Log("Node should have been created to refresh the palette, it's name is "+o.name);
    }
}
