using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using RealityFlow.Plugin.Scripts;
// using RealityFlow.Plugin.Scripts.Events;
using RuntimeGizmos;

public class doDelete : MonoBehaviour {

    GameObject mainCamera;
    TransformGizmo gizmo;

    // Initialize class variables
    private void Start()
    {
        mainCamera = GameObject.FindGameObjectWithTag("MainCamera");
        gizmo = mainCamera.GetComponent<TransformGizmo>();
    }

    // Deletes all selected objects.
    public void delete()
    {
        foreach (Transform t in gizmo.targetRootsOrdered)
        {
            //ObjectDeleteEvent del = new ObjectDeleteEvent();
            //del.Send(t.gameObject.GetComponent<FlowObject>().ft._id);
        }
    }
}
