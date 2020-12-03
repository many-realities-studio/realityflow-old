using Packages.realityflow_package.Runtime.scripts;
using RealityFlow.Plugin.Scripts;
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

    public GameObject deleteButton;

    private List<string> objectIds = new List<string>();

    public static string currentSelectedObjectId = null;


    public toggleButton previousToggleButton = null;
    // Initialize class variables
    private void Awake()
    {
        // create list of OutlinerItems
        OutlinerItems = new List<GameObject>();
        gizmo = mainCamera.GetComponent<RuntimeGizmos.TransformGizmo>();
       // objManger = GameObject.FindGameObjectWithTag("ObjManager");
        
    }

    // Creates a new entry for the object "obj" to the outliner.
    public void addItem(FlowTObject obj)
    {
        GameObject newItem = Instantiate(OutlinerItemPrefab) as GameObject;
        OutlinerItemManager itemManager = newItem.GetComponent<OutlinerItemManager>();
        Text objName = newItem.GetComponentInChildren<Text>();
        itemManager.manager = this;
        OutlinerItems.Add(newItem);
        objName.text = obj.Name;
        newItem.transform.SetParent(outlinerContent.transform);
        newItem.transform.localScale = Vector3.one;

        if (itemManager != null)
        {
            // populate variables
            itemManager.objName = name;
            itemManager.id = obj.Id;
            itemManager.obj = obj.AttachedGameObject;
            itemManager.index = OutlinerItems.Count - 1;
        }
        else
        {
            // error
            Debug.Log("New item " + name + " does not have OutlinerItemManager component in populateOutliner().");
        }
    }

    // v1 team -  Select an object in the world by clicking its name in the outliner. Currently broken.
    public void selectedInOutliner(OutlinerItemManager item)
    {
        
        Debug.Log("Selected in outliner");

        toggleButton toggle = item.GetComponent<toggleButton>();


        if (!toggle.IsPressed)
        {
            // deselect the previous toggle button
            if (previousToggleButton != null)
            {
                previousToggleButton.changeState();
                
            }

            toggle.changeState();
            currentSelectedObjectId = item.id;
            previousToggleButton = toggle;
            deleteButton.SetActive(true);


            if (gizmo != null)
            {
                gizmo.ClearAndAddTarget(item.obj.transform);
            }
            else
            {
                Debug.Log("gizmo is null in select");
            }
        }

        else
        {
            toggle.changeState();
            deleteButton.SetActive(false);
            previousToggleButton = null;
            currentSelectedObjectId = null;
        }
    }

    // v1 team - Select an object in the outliner when clicking the object in the world. Currently not broken
    // ... probably.
    public void selectedInWorld(Transform item)
    {
        //Debug.Log("Selected in world");

        //for (int j = 0; j < OutlinerItems.Count; j++)
        //{
        //    toggleButton toggle = OutlinerItems[j].GetComponent<toggleButton>();
        //    if (toggle != null)
        //    {
        //        // The fact that these toggle commands are commented out may be problematic though.
        //        if (OutlinerItems[j].GetComponent<OutlinerItemManager>().obj.transform == item && !toggle.IsPressed)
        //        {
        //            // select it!
        //            toggle.changeState();
        //        }
        //        else if (toggle.IsPressed)
        //        {
        //            // deselect it!
        //            //toggle.changeState();
        //        }
        //    }
        //}
    }


    /// <summary>
    /// Clears the outliner and repopulates it using the most up to date list of FlowTObjects
    /// </summary>
    public void RefreshList()
    {
        OutlinerItems.Clear();
        foreach(Transform child in outlinerContent)
        {
            GameObject.Destroy(child.gameObject);
        }

        objectIds.Clear();

        Debug.Log("The count is " + FlowTObject.idToGameObjectMapping.Count);
        foreach(FlowTObject obj in FlowTObject.idToGameObjectMapping.Values)
        {
          //  objectIds.Add(obj.Id);
            addItem(obj);
        }

        previousToggleButton = null;
    }



    /// <summary>
    /// Deletes an object when trying to delete from the scene panel. Refreshes
    /// the objects list if successful.
    /// </summary>
    public void DeleteObjectUsingOutliner()
    {
        if (currentSelectedObjectId == null)
            return;

        Operations.DeleteObject(currentSelectedObjectId, ConfigurationSingleton.SingleInstance.CurrentProject.Id, (_, e) =>
        {
            if (e.message.WasSuccessful == true)
            {
                RefreshList();
                deleteButton.SetActive(false);
            }
        });
    }
}
