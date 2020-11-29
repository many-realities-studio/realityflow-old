using System.Collections;
using System.Collections.Generic;
using UnityEngine;

// Helper script for the outliner manager.

public class OutlinerItemManager : MonoBehaviour {

    public string objName;
    public GameObject obj;
    public string id;
    public int index;
    public OutlinerManager manager;

    public void select()
    {
        manager.selectedInOutliner(this);
    }
}