using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class SelectedManger : MonoBehaviour {

    GameObject selectedObject;
    GameObject previousSelection;

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
