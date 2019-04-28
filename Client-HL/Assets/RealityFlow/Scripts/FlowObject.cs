using Assets.RealityFlow.Scripts.Events;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

// [ExecuteInEditMode]
public class FlowObject : MonoBehaviour {

	public bool selected = true;
	public FlowTObject ft;
    public FlowTObject pastState;
	ObjectUpdateEvent transformUpdateEvent = new ObjectUpdateEvent();
    bool registered = false;
	
	public static List<FlowObject> fos = new List<FlowObject>();

	// Use this for initialization
	public void Start () {
	    //ft = new FlowTObject(gameObject);
	    //ft.id = "1";
	    //ft._id = "1";
	    fos.Add(this);
	    //ft.RegisterTransform();
	}

	public static void registerObject() {
        foreach(FlowObject fo in fos)
		    fo.ft.RegisterTransform();

        fos.Clear();
	}
	
	// Update is called once per frame
	public void Update () {
        if (fos.Count > 0 && FlowNetworkManager.testProject != null)
            registerObject();

        //if (pastState.Equals(ft))
        //    selected = true;

        if (selected)
        {
            if (FlowNetworkManager.connected)
            {
                ft.Read();

                if (!pastState.Equals(ft))
                {
                    pastState.Copy(ft);
                    transformUpdateEvent.Send(ft);
                }
            }
        }
    }
}
