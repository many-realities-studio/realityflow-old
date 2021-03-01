using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.EventSystems;
using Microsoft.MixedReality.Toolkit.Input;

public class NodeManipulation : MonoBehaviour//,IMixedRealityPointerHandler
{
    // Start is called before the first frame update
    Vector3 position;
    Quaternion rotation;
    void Start()
    {
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
        if(Physics.Raycast(node.transform.position, node.transform.TransformDirection(Vector3.forward), out hit, Mathf.Infinity, LayerMask.NameToLayer("UI")))
        {
            Debug.DrawRay(node.transform.position, node.transform.TransformDirection(Vector3.forward) * hit.distance, Color.yellow);
            Debug.Log("Did Hit");
        }
        else
        {
            Debug.DrawRay(node.transform.position, node.transform.TransformDirection(Vector3.forward) * 1000, Color.white);
            Debug.Log("Did not Hit");
        }
    }

    public void AttachNodeToGraph()
    {
        // Once node is in range of graph, this function will stick the node to the graph
        /*GameObject child = gameObject.transform.GetChild(0).gameObject;
        var pointerHandler = child.GetComponent<PointerHandler>();
        pointerHandler.OnPointerDown.AddListener((e) =>
        {
            if (e.Pointer is SpherePointer)
            {
                Debug.Log("if 1");
                child.transform.parent = ((SpherePointer)(e.Pointer)).transform;
            }
            Debug.Log("else 1");
        });
        pointerHandler.OnPointerUp.AddListener((e) =>
        {
            if (e.Pointer is SpherePointer)
            {
                Debug.Log("if 2");
                child.transform.parent = null;
            }
            Debug.Log("else 2");
        });*/
        Debug.Log("Node should have attached to graph");
    }
    public void RefreshPalette()
    {
        // Once a node is dragged off of the command palette, this will add a new one to take its place immediately
        GameObject o = Instantiate(this.gameObject,position,rotation,this.transform.parent);
        Debug.Log("Node should have been created to refresh the palette, it's name is "+o.name);
    }
}
