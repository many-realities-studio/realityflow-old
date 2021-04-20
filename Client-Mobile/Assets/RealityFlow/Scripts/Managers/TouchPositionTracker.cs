using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class TouchPositionTracker : MonoBehaviour
{
     public GameObject touchPlaceTracker;
     
    // Allows for the movement around the GraphView panel using the Cinemachine Unity plugin.
    // This class is attached to an invisible gameobject that moves around the scene
    // That gameobject is then set to be the followed object by Cinemachine in the inspector.
    void Update()
    {
        if(Input.GetMouseButtonDown(0))
        {
            Vector3 mousePos = Input.mousePosition;
            // Debug.Log(mousePos);

            touchPlaceTracker.transform.position = mousePos;
        }
    }
}
