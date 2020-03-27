using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

// This script contains functions used to maintain the outliner.

public class OutlinerManager : MonoBehaviour {

    public Transform outlinerContent;
    public GameObject OutlinerItemPrefab;
    public Camera mainCamera;
    RuntimeGizmos.TransformGizmo gizmo;
    public List <GameObject> OutlinerItems;
    private GameObject objManger;
    
    // Initialize class variables
    private void Awake()
    {
        // create list of OutlinerItems
        OutlinerItems = new List<GameObject>();
        gizmo = mainCamera.GetComponent<RuntimeGizmos.TransformGizmo>();
        objManger = GameObject.FindGameObjectWithTag("ObjManager");
        
    }

    // Creates a new entry for the object "obj" to the outliner.
    public void addItem(GameObject obj)
    {
        GameObject newItem = Instantiate(OutlinerItemPrefab) as GameObject;
        OutlinerItemManager itemManager = newItem.GetComponent<OutlinerItemManager>();
        Text objName = newItem.GetComponentInChildren<Text>();
        itemManager.manager = this;
        OutlinerItems.Add(newItem);
        objName.text = obj.name;
        newItem.transform.SetParent(outlinerContent.transform);
        newItem.transform.localScale = Vector3.one;

        if (itemManager != null)
        {
            // populate variables
            itemManager.objName = name;
            itemManager.obj = obj;
            itemManager.index = OutlinerItems.Count - 1;
        }
        else
        {
            // error
            Debug.Log("New item " + name + " does not have OutlinerItemManager component in populateOutliner().");
        }
    }

    // Select an object in the world by clicking its name in the outliner. Currently broken.
    public void selectedInOutliner(OutlinerItemManager item)
    {
        Debug.Log("Selected in outliner");
        
        for (int j = 0; j < OutlinerItems.Count; j++)
        {
            toggleButton toggle = OutlinerItems[j].GetComponent<toggleButton>();
            if (toggle != null)
            {
                if (j == item.index && !toggle.IsPressed)
                {
                    // select it!
                    //toggle.changeState();
                    if (gizmo != null)
                    {
                        gizmo.ClearAndAddTarget(item.obj.transform);
                    }
                    else
                    {
                        Debug.Log("gizmo is null in select()");
                    }
                }
                else if (toggle.IsPressed)
                {
                    // deselect it!
                    //toggle.changeState();
                }
            }
        }
    }

    // Select an object in the outliner when clicking the object in the world. Currently not broken
    // ... probably.
    public void selectedInWorld(Transform item)
    {
        Debug.Log("Selected in world");
        
        for (int j = 0; j < OutlinerItems.Count; j++)
        {
            toggleButton toggle = OutlinerItems[j].GetComponent<toggleButton>();
            if (toggle != null)
            {
                // The fact that these toggle commands are commented out may be problematic though.
                if (OutlinerItems[j].GetComponent<OutlinerItemManager>().obj.transform == item && !toggle.IsPressed)
                {
                    // select it!
                    //toggle.changeState();
                }
                else if (toggle.IsPressed)
                {
                    // deselect it!
                    //toggle.changeState();
                }
            }
        }
    }

    // Clears the outliner and repopulates it using objManager's children. This will be useful for keeping the outliner
    // up to date.
    public void refreshList()
    {
        OutlinerItems.Clear();
        foreach(Transform child in outlinerContent)
        {
            GameObject.Destroy(child.gameObject);
        }

        foreach (Transform child in objManger.transform)
        {
            addItem(child.gameObject);
        }
    }
}
