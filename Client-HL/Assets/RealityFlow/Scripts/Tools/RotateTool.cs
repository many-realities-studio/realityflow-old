using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class RotateTool : MonoBehaviour
{

    // Rotation code based off of translation code, which is courtesy of Unity answers user daipayan123
    private Vector3 referencePoint;
    private Vector3 offset;
    private Vector3 rotate;
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
            referencePoint = Input.mousePosition;
        }
    }

    void OnMouseDrag()
    {
        if (isActive)
        {
            offset = Input.mousePosition - referencePoint;

            rotate.y = -(offset.x);
            rotate.x = -(offset.y);
            rotate.z = -(offset.z);

            transform.Rotate(rotate);

            referencePoint = Input.mousePosition;
        }
    }
}
