using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class OutlinerManager : MonoBehaviour {

    public Transform outlinerContent;
    public GameObject OutlinerItemPrefab;
    public Camera mainCamera;
    RuntimeGizmos.TransformGizmo gizmo;
    List<GameObject> OutlinerItems;
    
    private void Awake()
    {
        // create list of OutlinerItems
        OutlinerItems = new List<GameObject>();
        gizmo = mainCamera.GetComponent<RuntimeGizmos.TransformGizmo>();
    }

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
            itemManager.name = name;
            itemManager.obj = obj;
            itemManager.index = OutlinerItems.Count - 1;
        }
        else
        {
            // error
            Debug.Log("New item " + name + " does not have OutlinerItemManager component in populateOutliner().");
        }
    }

    public void select(OutlinerItemManager item)
    {
        for (int j = 0; j < OutlinerItems.Count; j++)
        {
            toggleButton toggle = OutlinerItems[j].GetComponent<toggleButton>();
            if (toggle != null)
            {
                if (j == item.index && !toggle.IsPressed)
                {
                    // select it!
                    toggle.changeState();
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
                    toggle.changeState();
                }
            }
        }
    }
}
