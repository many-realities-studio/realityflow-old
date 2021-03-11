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

    public GameObject rfgvGameObject; // realityflowgraphview script
    public RealityFlowGraphView rfgv;
    public BaseGraph graph;
    void Start()
    {
        rfgvGameObject = GameObject.Find("RuntimeGraph");
        rfgv = rfgvGameObject.GetComponent<RealityFlowGraphView>();
        graph = rfgv.graph;
        position = this.transform.position;
        rotation = this.transform.rotation;
    }
    void OnCollisionEnter(Collision col)
    {
        if(col.gameObject.tag == "Canvas")
            Debug.LogError("COLLISION!");
    }

   
   /* public void OnPointerDown(MixedRealityPointerEventData eventData)
    {
        if (eventData.Pointer is SpherePointer)
        {
            Debug.Log($"Grab start from {eventData.Pointer.PointerName}");
        }
        if (eventData.Pointer is PokePointer)
        {
            Debug.Log($"Touch start from {eventData.Pointer.PointerName}");
        }
    }

    public void OnPointerClicked(MixedRealityPointerEventData eventData) {}
    public void OnPointerDragged(MixedRealityPointerEventData eventData) {}
    public void OnPointerUp(MixedRealityPointerEventData eventData) {}*/
    public void NodeRaycastCreation()
    {
        GameObject node = gameObject.transform.GetChild(0).gameObject;
        RaycastHit hit;
        if(Physics.Raycast(node.transform.position, node.transform.TransformDirection(Vector3.forward), out hit, Mathf.Infinity))
        {
            //Debug.DrawRay(node.transform.position, node.transform.TransformDirection(Vector3.forward) * hit.distance, Color.green);
            Debug.Log("Did Hit");
            AttachNodeToGraph();
        }
        else
        {
            //Debug.DrawRay(node.transform.position, node.transform.TransformDirection(Vector3.forward) * 1000, Color.red);
            Debug.Log("Did not Hit");
        }
    }

    public void AttachNodeToGraph()
    {
        rfgv.AddNodeCommand();
        Destroy(this.gameObject);
    }
    public void RefreshPalette()
    {
        // Once a node is dragged off of the command palette, this will add a new one to take its place immediately
        GameObject o = Instantiate(this.gameObject,position,rotation,this.transform.parent);
        Debug.Log("Node should have been created to refresh the palette, it's name is "+o.name);
    }
}
