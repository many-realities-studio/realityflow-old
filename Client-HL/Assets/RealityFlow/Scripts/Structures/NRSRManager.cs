using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System;
using HoloToolkit.Unity;

public class NRSRManager : Singleton<NRSRManager>
{

    public Renderer[] objInScene;
    public List<GameObject> interactiveObjInScene = new List<GameObject>();

    public int curObjectCount = 0;
    public int prevObjectCount = 0;

    public int interactiveObjCount;
    public int toolCount;

    public Material mat;

    public static GameObject focusedObject;

    public delegate void onObjectFocused();
    public static event onObjectFocused objectFocused;
    public static event onObjectFocused objectUnFocused;

    public RaycastHit hitInfo;
    public static bool holdSelectedObject_LookingAtTransformTool;
    public static bool holdSelectedObject_UsingTransformTool;
    LayerMask layerMask;
    public static Vector3 menuPosition;

    private void Start()
    {

        layerMask = 1 << 23;
        layerMask = ~layerMask;
        
    }

    private void Update()
    {
        if (holdSelectedObject_UsingTransformTool)
            return;

        raycastToHoldFocusedObject();
        menuPosition = hitInfo.point;

        if (holdSelectedObject_LookingAtTransformTool)
        {
            objectFocused?.Invoke();
        }
        else
        {
            focusedObject = null;
            objectUnFocused?.Invoke();
        }
    }

    public void raycastToHoldFocusedObject()
    {
        if (Physics.Raycast(Camera.main.transform.position, Camera.main.transform.forward,
            out hitInfo, Mathf.Infinity, layerMask))
        {
            if (hitInfo.transform == null)
            {
                holdSelectedObject_LookingAtTransformTool = false;
                return;
            }

            if (focusedObject != null)
            {
                if (focusedObject.transform.root.name == hitInfo.transform.root.name)
                {
                    holdSelectedObject_LookingAtTransformTool = true;
                }
                else
                    holdSelectedObject_LookingAtTransformTool = false;
            }
        }
        else
            holdSelectedObject_LookingAtTransformTool = false;
    }

    private void FixedUpdate()
    {
        findObjectsInScene();

        curObjectCount = objInScene.Length;

        if (curObjectCount != prevObjectCount)
        {
            filterObjects();
            interactiveObjCount = interactiveObjInScene.Count;

            foreach (GameObject go in interactiveObjInScene)
            {
                if (go.transform.root.gameObject.GetComponent<HighlightBox>() == null)
                {
                    go.transform.root.gameObject.AddComponent<HighlightBox>();
                    go.transform.root.gameObject.AddComponent<FadeObjectNotActive>();
                    go.transform.root.gameObject.GetComponent<HighlightBox>().isRootObject = true;
                }
            }
        }

        prevObjectCount = curObjectCount;
    }

    void findObjectsInScene()
    {
        objInScene = null;
        objInScene = FindObjectsOfType<Renderer>();
    }

    void filterObjects()
    {
        interactiveObjInScene.Clear();
        toolCount = 0;

        for (int i = 0; i < objInScene.Length; i++)
        {
            if (objInScene[i].gameObject.tag != "Tool")
            {
                interactiveObjInScene.Add(objInScene[i].gameObject);
            }
            else
                toolCount++;
        }
    }

    public static void sendFocusedObjectToManager(GameObject _focusedObject)
    {
        focusedObject = _focusedObject;
    }

    public static void clearFocusedObjectFromManager()
    {
        focusedObject = null;
    }
}
