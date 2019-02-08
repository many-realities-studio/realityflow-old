using HoloToolkit.Unity.InputModule;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class HighlightBox : MonoBehaviour, IFocusable {

    Material highlightBoxMat;
    GameObject srsBoundingBox;
    Bounds srsBounds;
    bool isActive;
    public bool boundingBoxCreated;
    public bool isRootObject;

    public void OnFocusEnter()
    {
        if (boundingBoxCreated && !isActive)
            isActive = true;

        NRSRManager.sendFocusedObjectToManager(gameObject);
    }

    public void OnFocusExit()
    {
        if (boundingBoxCreated && isActive)
            isActive = false;

        NRSRManager.clearFocusedObjectFromManager();
    }

    // Use this for initialization
    void Start ()
    {		
        highlightBoxMat = NRSRManager.Instance.mat;
	}
	
	// Update is called once per frame
	void Update ()
    {
		if(!boundingBoxCreated && isRootObject)
        {
            createBoundingBox();
            boundingBoxCreated = true;
        }

        if (srsBoundingBox != null)
            srsBoundingBox.SetActive(isActive);
	}

    void createBoundingBox()
    {
        srsBoundingBox = Instantiate(gameObject);
        srsBoundingBox.name = "HighlightBox";

        if(srsBoundingBox.GetComponent<HighlightBox>() == null)
        {
            Destroy(srsBoundingBox);
            return;
        }

        Destroy(srsBoundingBox.GetComponent<HighlightBox>());
        srsBoundingBox.tag = "Tool";
        srsBoundingBox.transform.localScale *= 1.1f;

        srsBoundingBox.transform.parent = gameObject.transform;

        List<Transform> children = new List<Transform>(srsBoundingBox.GetComponentsInChildren<Transform>());
        foreach(Transform child in children)
        {
            child.tag = "Tool";
            if(child.GetComponent<MeshRenderer>() != null)
            {
                child.GetComponent<MeshRenderer>().material = highlightBoxMat;
                child.transform.parent = srsBoundingBox.transform;
            }
        }

        List<MeshFilter> childrenBounds = new List<MeshFilter>(srsBoundingBox.GetComponentsInChildren<MeshFilter>());
        foreach(MeshFilter meshRen in childrenBounds)
        {
            if(meshRen.GetComponent<MeshFilter>() != null)
            srsBounds.Encapsulate(meshRen.GetComponent<MeshFilter>().mesh.bounds);
        }

        List<Vector3> srsPoints = new List<Vector3>();
        srsPoints.Add(srsBounds.min * gameObject.transform.localScale.x * 1.1f);
        srsPoints.Add(srsBounds.max * gameObject.transform.localScale.z * 1.1f);
        srsPoints.Add(new Vector3(srsPoints[0].x, srsPoints[0].y, srsPoints[1].z));
        srsPoints.Add(new Vector3(srsPoints[0].x, srsPoints[1].y, srsPoints[0].z));
        srsPoints.Add(new Vector3(srsPoints[1].x, srsPoints[0].y, srsPoints[0].z));
        srsPoints.Add(new Vector3(srsPoints[0].x, srsPoints[1].y, srsPoints[1].z));
        srsPoints.Add(new Vector3(srsPoints[1].x, srsPoints[0].y, srsPoints[1].z));
        srsPoints.Add(new Vector3(srsPoints[1].x, srsPoints[1].y, srsPoints[0].z));

        //foreach (Vector3 point in srsPoints)
        //    createEndPoints(point + transform.position);
    }

    void createEndPoints(Vector3 position)
    {
        GameObject cornerHandle = GameObject.CreatePrimitive(PrimitiveType.Sphere);

        cornerHandle.name = "Handle";
        cornerHandle.tag = "Tool";

        cornerHandle.transform.localScale *= .15f;
        cornerHandle.transform.position = position;
        cornerHandle.transform.parent = srsBoundingBox.transform;
        cornerHandle.GetComponent<Renderer>().material = highlightBoxMat;
    }
}
