using Assets.RealityFlow.Scripts.Events;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class grabProject : MonoBehaviour {

    public string id;
    public GameObject objManager;

    public void getProject()
    {
        clearCurrentProject();

        Config.projectId = id;

        ProjectFetchEvent fetch = new ProjectFetchEvent();
        fetch.Send();
    }

    public void clearCurrentProject()
    {
        objManager.GetComponent<SelectedManger>().deselectObject();

        Config.objs = new List<FlowTObject>();
        FlowProject.activeProject.transforms = new List<FlowTObject>();
        FlowProject.activeProject.transformsById = new Dictionary<string, FlowTObject>();

        foreach (Transform child in objManager.transform)
        {
            Destroy(child.gameObject);
        }
    }
}
