using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class SelectedManger : MonoBehaviour {

    public GameObject selectedObject;
    GameObject previousSelection;

    public bool checkOut(GameObject pickedObject)
    {
        //make server call to see if successful
        selectedObject = pickedObject;
        if(selectedObject!=null)
            selectedObject.GetComponent<FlowObject>().selected = true;
        return true;
        //else return false
    }
    public bool returnObject()
    {
        //make server call to deselect object
        if (selectedObject != null)
            selectedObject.GetComponent<FlowObject>().selected = false;
        selectedObject = null;
        return true;
        //else return false
    }

    public void updateSelected(GameObject passedObject)
    {
        selectedObject = passedObject;
        {
            if(selectedObject != previousSelection)
            {
                if (previousSelection != null)
                    deselectObject(previousSelection);
                previousSelection = selectedObject;
                selectObject(selectedObject);
            }
            else if(selectedObject == previousSelection)
            {
                if(selectedObject!=null)
                {
                    deselectObject(selectedObject);
                    selectedObject = null;
                    previousSelection = null;
                }

            }
        }
    }

    void selectObject(GameObject passedObject)
    {
        passedObject.GetComponent<MeshRenderer>().material.shader = Shader.Find("Selected");

    }

    void deselectObject(GameObject passedObject)
    {
        passedObject.GetComponent<MeshRenderer>().material.shader = Shader.Find("Standard");

    }
}
