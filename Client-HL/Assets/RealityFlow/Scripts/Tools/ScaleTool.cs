using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class ScaleTool : MonoBehaviour {

    // Scaling code based off of translation code, which is courtesy of Unity answers user daipayan123
    private Vector3 screenPoint;
    private Vector3 offset;
    public bool isActive;
    public bool IsActive
    {
        get { return isActive; }
        set { isActive = value; }
    }

    private void Start()
    {
        isActive = false;
    }


    void OnMouseDown()
    {
        if (isActive)
        {
            screenPoint = Camera.main.WorldToScreenPoint(transform.position);
            offset = transform.localScale - Camera.main.ScreenToWorldPoint(new Vector3(Input.mousePosition.x, Input.mousePosition.y, screenPoint.z));
        }
    }

    void OnMouseDrag()
    {
        if (isActive)
        {
            Vector3 curScreenPoint = new Vector3(Input.mousePosition.x, Input.mousePosition.y, screenPoint.z);
            Vector3 curPosition = Camera.main.ScreenToWorldPoint(curScreenPoint) + offset;
            transform.localScale = curPosition;
        }   
    }
}
