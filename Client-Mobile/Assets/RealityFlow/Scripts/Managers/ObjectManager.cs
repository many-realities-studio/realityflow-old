//using System.Collections;
//using System.Collections.Generic;
//using UnityEngine;
//using System.IO;
//using UnityEngine.UI;
//using RealityFlow.Plugin.Scripts;
//using RealityFlow.Plugin.Scripts.Events;

//// This script contains functions necessary for populating the scene with objects.

//public class ObjectManager : MonoBehaviour {

//    // original test structures
//    public Transform testSphere;
//    public Transform testCube;
//    public Transform testCapsule;

//    // structures for resource based spawner
//    public ObjectDataList objects;
//    private const string prefabPath = "Prefabs/";
//    private const string modelPath = "Assets/Resources/Models/";
//    private ObjectData loadedData;
//    private GameObject myPrefab;
//    private bool populated;

//    // outliner
//    public Transform outlinerContent;
//    public GameObject OutlinerItemPrefab;
//    public GameObject outliner;

//    // Load all objects in the scene
//    void Start()
//    {
//        ProjectFetchEvent fetch = new ProjectFetchEvent();
//        fetch.Send();

//        // initialize network manager
//        if (GameObject.FindGameObjectWithTag("NetworkManager") != null &&
//            GameObject.FindGameObjectWithTag("NetworkManager").GetComponent<FlowNetworkManager>() != null)
//        {
//            FlowNetworkManager manager_component = GameObject.FindGameObjectWithTag("NetworkManager").GetComponent<FlowNetworkManager>();
//            manager_component.mainGameCamera = GameObject.FindGameObjectWithTag("MainCamera");
//            manager_component.eventSystem = GameObject.FindGameObjectWithTag("EventSystem");
//        }

//    }

//    public void Update()
//    {

//        if (outliner != null)
//        {
//            OutlinerManager manager = outliner.GetComponent<OutlinerManager>();
//            if ((manager != null && manager.OutlinerItems.Capacity == 0) || !populated)
//            {
//                foreach (Transform child in GameObject.FindGameObjectWithTag("ObjManager").transform)
//                {
//                    outliner.GetComponent<OutlinerManager>().addItem(child.gameObject);
//                }
//            }
//            populated = true;
//        }
//    }

//    // This function is courtesy of Unity forums user Remix000
//    private Vector3 stringToVector3(string s)
//    {
//        // Remove parentheses from tuple and separate tuple values into array
//        // entries
//        string[] temp = s.Substring(1, s.Length - 2).Split(',');
//        // Read tuple values into float variables
//        float x = float.Parse(temp[0]);
//        float y = float.Parse(temp[1]);
//        float z = float.Parse(temp[2]);
//        Vector3 retVal = new Vector3(x, y, z);
//        return retVal;
//    }

//    // Converts a string representation of a 4-tuple to a quaternion
//    private Quaternion stringToQuaternion(string s)
//    {
//        // Remove parentheses from tuple and separate tuple values into array
//        // entries
//        string[] temp = s.Substring(1, s.Length - 2).Split(',');
//        // Read tuple values into float variables
//        float x = float.Parse(temp[0]);
//        float y = float.Parse(temp[1]);
//        float z = float.Parse(temp[2]);
//        float w = float.Parse(temp[3]);
//        Quaternion retVal = new Quaternion(x, y, z, w);
//        return retVal;
//    }
//}
