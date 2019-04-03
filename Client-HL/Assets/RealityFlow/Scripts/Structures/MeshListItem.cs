using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class MeshListItem : MonoBehaviour {

    public string name;
    //public GameObject obj;
    public int index;
    public MeshListManager manager;
    public OBJData model;

    public void select()
    {
        manager.select(this);
    }
}
