using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class TransformMenuMovement : MonoBehaviour {

    Bounds toolBounds;
    GameObject cursor;
    bool initialSetupComplete = false;

	// Use this for initialization
	void Start ()
    {
		
	}
	
	// Update is called once per frame
	void Update ()
    {
		if(transform.localPosition.x - cursor.transform.localPosition.x > toolBounds.extents.x / 3 ||
            transform.localPosition.x - cursor.transform.localPosition.x < -toolBounds.extents.x / 3 ||
            transform.localPosition.y - cursor.transform.localPosition.y > toolBounds.extents.y / 3 ||
            transform.localPosition.y - cursor.transform.localPosition.y < -toolBounds.extents.y / 3)
        {
            transform.position = Vector3.Lerp(transform.position, cursor.transform.position, 0.02f);
        }

        transform.rotation = Quaternion.Lerp(transform.rotation, cursor.transform.rotation * Quaternion.Euler(0, 0, 180), 1);

        transform.position = new Vector3(transform.position.x, transform.position.y, cursor.transform.position.z - 0.3f);
	}

    void enabledGetPosition()
    {
        if(!initialSetupComplete)
        {
            transform.position = cursor.transform.position;
            transform.rotation = cursor.transform.rotation * Quaternion.Euler(0, 0, 180);
            initialSetupComplete = true;
        }
    }

    void disabledReset()
    {
        initialSetupComplete = false;
    }

    private void OnEnable()
    {
        NRSRManager.objectFocused += enabledGetPosition;
        NRSRManager.objectUnFocused += disabledReset;

        toolBounds = getBoundsForAllChildren(gameObject);
        cursor = GameObject.Find("BasicCursor");
    }

    private void OnDisable()
    {
        NRSRManager.objectFocused -= enabledGetPosition;
        NRSRManager.objectUnFocused -= disabledReset;
    }

    public Bounds getBoundsForAllChildren(GameObject findMyBounds)
    {
        Bounds result = new Bounds(Vector3.zero, Vector3.zero);

        foreach(Collider coll in findMyBounds.GetComponentsInChildren<Collider>())
        {
            if (result.extents == Vector3.zero)
            {
                result = coll.bounds;
            }
            else
                result.Encapsulate(coll.bounds);
        }

        return result;
    }
}
