using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class SelectedManger : MonoBehaviour {

    //GameObject selectedObject;
    public GameObject curSelection; //{ get; set; }
    public GameObject mainCamera;

    public void updateSelected(GameObject passedObject)
    {
        //selectedObject = passedObject;
        {
            if(passedObject != curSelection)
            {
                if (curSelection != null)
                    deselectObject(curSelection);

                selectObject(passedObject);
            }
            else if(passedObject == curSelection)
            {
                if(passedObject!=null)
                {
                    deselectObject(passedObject);
                    //selectedObject = null;
                    curSelection = null;
                }

            }
        }
    }

    void selectObject(GameObject passedObject)
    {
        // try to reserver object from server
        if(passedObject.GetComponent<FlowObject>().registered) return;
        // else do the following

        passedObject.GetComponent<FlowObject>().selected = true;
        mainCamera.GetComponent<RuntimeGizmos.TransformGizmo>().AddTarget(passedObject.transform);
        passedObject.GetComponent<MeshRenderer>().material.shader = Shader.Find("Selected");

        curSelection = passedObject;
    }

    public void deselectObject(GameObject passedObject)
    {
        passedObject.GetComponent<FlowObject>().selected = false;
        mainCamera.GetComponent<RuntimeGizmos.TransformGizmo>().RemoveTarget(passedObject.transform);
        passedObject.GetComponent<MeshRenderer>().material.shader = Shader.Find("Standard");
    }

    public void deselectObject()
    {
        if(curSelection!=null)
        {
            curSelection.GetComponent<FlowObject>().selected = false;
            mainCamera.GetComponent<RuntimeGizmos.TransformGizmo>().RemoveTarget(curSelection.transform);
            curSelection.GetComponent<MeshRenderer>().material.shader = Shader.Find("Standard");
        }

    }
}
