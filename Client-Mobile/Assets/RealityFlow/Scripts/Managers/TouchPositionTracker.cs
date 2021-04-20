using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class TouchPositionTracker : MonoBehaviour
{
     public GameObject touchPlaceTracker;
     
    // Start is called before the first frame update
    void Start()
    {
        
    }

    // Update is called once per frame
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
