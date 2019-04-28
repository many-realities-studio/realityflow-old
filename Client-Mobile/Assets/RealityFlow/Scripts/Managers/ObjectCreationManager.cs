using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using Assets.RealityFlow.Scripts.Events;

// This script contains functions necessary for adding new objects to the scene. 
// It currently supports creating cube, spheres, and capsules.

public class ObjectCreationManager : MonoBehaviour {

    // Creates an object based on the argument i.
	public void createObject(int i)
    {
        GameObject refObj = null;

        switch (i)
        {
            case (0):
                refObj = GameObject.CreatePrimitive(PrimitiveType.Cube);
                refObj.name = "Cube";
                break;
            case (1):
                refObj = GameObject.CreatePrimitive(PrimitiveType.Sphere);
                refObj.name = "Sphere";
                break;
            case (2):
                refObj = GameObject.CreatePrimitive(PrimitiveType.Capsule);
                refObj.name = "Capsule";
                break;
        }

        // Basis for creating objects from a mesh. The idea is to spawn a new object
        // with the mesh far off screen, get the mesh data, and use it to create the
        // a new object.
        if (refObj != null)
        {
            refObj.transform.position = new Vector3(9999, 9999, 9999);

            FlowTObject obj = new FlowTObject();
            obj.vertices = refObj.GetComponent<MeshFilter>().mesh.vertices;
            obj.uv = refObj.GetComponent<MeshFilter>().mesh.uv;
            obj.triangles = refObj.GetComponent<MeshFilter>().mesh.triangles;
            obj.x = 0;
            obj.y = 0;
            obj.z = 0;
            Quaternion rot = refObj.transform.rotation;
            obj.q_x = rot.x;
            obj.q_y = rot.y;
            obj.q_z = rot.z;
            obj.q_w = rot.w;
            obj.s_x = refObj.transform.localScale.x;
            obj.s_y = refObj.transform.localScale.y;
            obj.s_z = refObj.transform.localScale.z;
            obj.type = "BoxCollider";
            obj.name = refObj.name;
            obj.color = new Color(1,1,1,1);

            ObjectCreationEvent createObject = new ObjectCreationEvent();
            createObject.Send(obj);

            GameObject.Destroy(refObj);
        }


    }
}
