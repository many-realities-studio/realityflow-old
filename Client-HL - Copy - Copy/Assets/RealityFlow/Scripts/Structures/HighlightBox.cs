using HoloToolkit.Unity.InputModule;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class HighlightBox : MonoBehaviour, IFocusable, IInputHandler {

    Material gazedMat;
    Material selectMat;

    GameObject gazeBox;
    GameObject selectBox;

    Bounds srsBounds;

    bool isGazed;
    bool isSelected;

    public bool boundBoxsCreated;
    public bool isRootObject;

    // Use this for initialization
    void Start ()
    {		
        selectMat = NRSRManager.Instance.mat;
	}
	
	// Update is called once per frame
	void Update ()
    {
		if(!boundBoxsCreated && isRootObject)
            createBoundingBox();

        if (gazeBox != null)
            gazeBox.SetActive(isGazed);

        if (selectBox != null)
            selectBox.SetActive(isSelected);
	}

    public void OnFocusEnter()
    {
        if (boundBoxsCreated && !isGazed)
            isGazed = true;
    }

    public void OnFocusExit()
    {
        if (!boundBoxsCreated || !isGazed)
            return;
   
        isGazed = false;
    }

    public void OnInputDown(InputEventData eventData)
    {
        if (!boundBoxsCreated)
            return;

        if(isSelected)
        {
            NRSRManager.clearFocusedObjectFromManager();
        }
        else
        {
            NRSRManager.clearFocusedObjectFromManager();
            NRSRManager.sendFocusedObjectToManager(gameObject);
            isSelected = true;
        }
    }

    public void OnInputUp(InputEventData eventData) {}

    public void onObjectUnselect()
    {
        isSelected = false;
    }

    public void OnEnable()
    {
        NRSRManager.objectUnFocused += onObjectUnselect;
    }

    public void OnDisable()
    {
        NRSRManager.objectUnFocused -= onObjectUnselect;
    }

    void createBoundingBox()
    {
        selectBox = Instantiate(gameObject);
        selectBox.name = "selectBox";

        if(selectBox.GetComponent<HighlightBox>() == null)
        {
            Destroy(selectBox);
            return;
        }

        Destroy(selectBox.GetComponent<HighlightBox>());
        selectBox.tag = "Tool";

        gazeBox = Instantiate(selectBox);
        gazeBox.name = "gazeBox";

        gazeBox.transform.localScale *= 1.1f;
        selectBox.transform.localScale *= 1.1f;

        selectBox.transform.parent = gameObject.transform;
        gazeBox.transform.parent = gameObject.transform;

        List<Transform> selectChildren = new List<Transform>(selectBox.GetComponentsInChildren<Transform>());
        List<Transform> gazedChildren = new List<Transform>(gazeBox.GetComponentsInChildren<Transform>());
        for(int i = 0; i < gazedChildren.Count; i++)
        {
            selectChildren[i].tag = "Tool";
            gazedChildren[i].tag = "Tool";

            if (selectChildren[i].GetComponent<MeshRenderer>() != null)
            {
                selectChildren[i].GetComponent<MeshRenderer>().material = selectMat;
                selectChildren[i].transform.parent = selectBox.transform;
            }

            if (gazedChildren[i].GetComponent<MeshRenderer>() != null)
            {
                gazedChildren[i].transform.parent = gazeBox.transform;
            }
        }

        boundBoxsCreated = true;

        //List<MeshFilter> childrenBounds = new List<MeshFilter>(selectBox.GetComponentsInChildren<MeshFilter>());
        //foreach(MeshFilter meshRen in childrenBounds)
        //{
        //    if(meshRen.GetComponent<MeshFilter>() != null)
        //        srsBounds.Encapsulate(meshRen.GetComponent<MeshFilter>().mesh.bounds);
        //}

        //List<Vector3> srsPoints = new List<Vector3>();
        //srsPoints.Add(srsBounds.min * gameObject.transform.localScale.x * 1.1f);
        //srsPoints.Add(srsBounds.max * gameObject.transform.localScale.z * 1.1f);
        //srsPoints.Add(new Vector3(srsPoints[0].x, srsPoints[0].y, srsPoints[1].z));
        //srsPoints.Add(new Vector3(srsPoints[0].x, srsPoints[1].y, srsPoints[0].z));
        //srsPoints.Add(new Vector3(srsPoints[1].x, srsPoints[0].y, srsPoints[0].z));
        //srsPoints.Add(new Vector3(srsPoints[0].x, srsPoints[1].y, srsPoints[1].z));
        //srsPoints.Add(new Vector3(srsPoints[1].x, srsPoints[0].y, srsPoints[1].z));
        //srsPoints.Add(new Vector3(srsPoints[1].x, srsPoints[1].y, srsPoints[0].z));

        //foreach (Vector3 point in srsPoints)
        //    createEndPoints(point + transform.position);

    }

    //void createEndPoints(Vector3 position)
    //{
    //    GameObject cornerHandle = GameObject.CreatePrimitive(PrimitiveType.Sphere);

    //    cornerHandle.name = "Handle";
    //    cornerHandle.tag = "Tool";

    //    cornerHandle.transform.localScale *= .15f;
    //    cornerHandle.transform.position = position;
    //    cornerHandle.transform.parent = selectBox.transform;
    //    cornerHandle.GetComponent<Renderer>().material = selectMat;
    //}

}
