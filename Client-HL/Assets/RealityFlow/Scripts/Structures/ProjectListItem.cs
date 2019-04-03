using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class ProjectListItem : MonoBehaviour {

    public string name;
    public string id;
    //public GameObject obj;
    public int index;
    public ProjectListManager manager;

    public void select()
    {
        manager.select(this);
    }
}
