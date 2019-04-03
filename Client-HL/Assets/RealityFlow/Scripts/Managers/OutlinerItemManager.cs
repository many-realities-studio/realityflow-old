using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class OutlinerItemManager : MonoBehaviour {

    public string name;
    public GameObject obj;
    public int index;
    public OutlinerManager manager;

    public void select()
    {
        manager.select(this);
    }
}