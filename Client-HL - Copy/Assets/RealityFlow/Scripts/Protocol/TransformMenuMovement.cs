using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class TransformMenuMovement : MonoBehaviour {

    GameObject cursor;

	// Use this for initialization
	void Start ()
    {
		
	}
	
	// Update is called once per frame
	void Update ()
    {
        if (NRSRManager.focusedObject == null)
            return;

        Vector3 objPoint = NRSRManager.focusedObject.transform.position;
        Vector3 usrPoint = Camera.main.transform.position;

        Vector3 delta = objPoint - usrPoint;

        transform.position = usrPoint + delta / 2;
        transform.position -= new Vector3(0, NRSRManager.focusedObject.transform.lossyScale.y/3, 0);
        transform.rotation = cursor.transform.rotation * Quaternion.Euler(0, 0, 180);
    }

}
