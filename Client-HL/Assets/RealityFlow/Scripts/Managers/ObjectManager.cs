using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System.IO;
using UnityEngine.UI;

// TODO:
// make file path a constant

public class ObjectManager : MonoBehaviour {

    // original test structures
    public Transform testSphere;
    public Transform testCube;
    public Transform testCapsule;

    // structures for resource based spawner
    public ObjectDataList objects = new ObjectDataList();
    private const string dataFileName = "testJSON.json";
    private ObjectData loadedData;
    private GameObject myPrefab;

    // outliner
    public Transform outlinerContent;
    public GameObject OutlinerItemPrefab;

    void Start()
    {
        LoadJSON();
        
        // spawn using resource based spawner
        foreach (ObjectData obj in objects.objects)
        {
            myPrefab = Resources.Load("Prefabs/" + obj.prefab) as GameObject;
            GameObject temp = Instantiate(myPrefab, stringToVector3(obj.position), Quaternion.identity);
            temp.AddComponent<Selector>();

            // Add outline to object, which is used to show whether or not the object is selected
            var outline = temp.AddComponent<Outline>();
            outline.OutlineColor = new Color(0f, 0.141f, 1f);
            outline.OutlineWidth = 1f;
            outline.enabled = false;

            // Add translation, rotation, and scaling tools to object
            temp.AddComponent<TranslateTool>();
            temp.AddComponent<ScaleTool>();
            temp.AddComponent<RotateTool>();

            populateOutliner(obj.name);
        }
    }

    // This function is courtesy of Unity forums user Remix000
    private Vector3 stringToVector3(string s)
    {
        // Remove parentheses from tuple and separate tuple values into array
        // entries
        string[] temp = s.Substring(1, s.Length - 2).Split(',');
        // Read tuple values into float variables
        float x = float.Parse(temp[0]);
        float y = float.Parse(temp[1]);
        float z = float.Parse(temp[2]);
        Vector3 retVal = new Vector3(x, y, z);
        return retVal;
    }

    // Converts a string representation of a 4-tuple to a quaternion
    private Quaternion stringToQuaternion(string s)
    {
        // Remove parentheses from tuple and separate tuple values into array
        // entries
        string[] temp = s.Substring(1, s.Length - 2).Split(',');
        // Read tuple values into float variables
        float x = float.Parse(temp[0]);
        float y = float.Parse(temp[1]);
        float z = float.Parse(temp[2]);
        float w = float.Parse(temp[3]);
        Quaternion retVal = new Quaternion(x, y, z, w);
        return retVal;
    }

    private void LoadJSON()
    {
        // This grabs the filename from the root directory, which --- for a 
        // given project --- is the directory that contains the assets folder.
        // To access a file in a subdirectory, a line of code more like this
        // would be used:
        //
        // string filePath = Path.Combine(Application.streamingAssetsPath, dataFileName);
        //
        // Where "streamingAssetsPath" would be placed with the directory
        // where the JSON file to be loaded is stored. Path.Combine() seems to
        // be for formatting these sort of file paths.
        string filePath = dataFileName;

        if (File.Exists(filePath))
        {
            string rawJSON = File.ReadAllText(filePath);
            if (rawJSON != null)
            {
                objects = JsonUtility.FromJson<ObjectDataList>(rawJSON);
            }
            else
            {
                Debug.Log("rawJSON is null in LoadJSON().");
            }
        }
        else
        {
            Debug.LogError("Cannot load object data!");
        }
    }

    public void populateOutliner(string name)
    {
        Debug.Log(name);
        GameObject newItem = Instantiate(OutlinerItemPrefab) as GameObject;
        Text objName = newItem.GetComponentInChildren<Text>();
        objName.text = name;
        newItem.transform.SetParent(outlinerContent.transform);
        newItem.transform.localScale = Vector3.one;
    }
}
