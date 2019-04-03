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

    public Transform focusedTransform;

    public static GameObject focusedObject;

    public delegate void onObjectFocused();
    public static event onObjectFocused objectFocused;
    public static event onObjectFocused objectUnFocused;

    private void Start()
    {
        
    }

    private void Update()
    {

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

        if(focusedObject == null)
        {
            focusedTransform = null;
        }
        else
            focusedTransform = focusedObject.transform;
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
        objectFocused?.Invoke();
    }

    public static void clearFocusedObjectFromManager()
    {
        focusedObject = null;
        objectUnFocused?.Invoke();
    }
}
