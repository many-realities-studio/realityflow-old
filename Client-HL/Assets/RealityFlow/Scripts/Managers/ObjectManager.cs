using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System.IO;
using UnityEngine.UI;
using UnityExtension;

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
    private const string prefabPath = "Prefabs/";
    private const string modelPath = "Assets/Resources/Models/";
    private ObjectData loadedData;
    private GameObject myPrefab;

    // outliner
    public Transform outlinerContent;
    public GameObject OutlinerItemPrefab;
    public GameObject outliner;

    // Load all objects in the scene
    void Start()
    {
        LoadJSON();
        
        // spawn using resource based spawner
        foreach (ObjectData obj in objects.objects)
        {
            myPrefab = Resources.Load(prefabPath + obj.prefab) as GameObject;
            GameObject temp = Instantiate(myPrefab, stringToVector3(obj.position), Quaternion.identity);
            temp.transform.localScale = stringToVector3(obj.scale);
            temp.name = obj.name;

            if (obj.prefab == "Mesh")
            {
                // Initialize Mesh variables
                //GameObject loadedModelObj = Resources.Load(modelPath + obj.mesh) as GameObject;
                //Mesh mesh = loadedModelObj.GetComponent<MeshFilter>().mesh;
                MeshFilter objMesh = temp.GetComponent<MeshFilter>();

                //	Load the OBJ in
                var lStream = new FileStream(modelPath + obj.mesh, FileMode.Open);
                var meshObj = OBJLoader.LoadOBJ(lStream);
                //var mesh = GetComponent<MeshFilter>();
                objMesh.mesh.LoadOBJ(meshObj);
                lStream.Close();

                lStream = null;
                meshObj = null;

                // Generate new collider
                Destroy(temp.GetComponent<Collider>());
                temp.AddComponent<BoxCollider>();

                // Test code to auto resize the object
                //objMesh.transform.localScale = new Vector3(0.1f, 0.1f, 0.1f); ;

                /*if (mesh != null)
                {
                    objMesh.vertices = mesh.mesh.vertices;
                    objMesh.uv = mesh.mesh.uv;
                    objMesh.triangles = mesh.mesh.triangles;
                    objMesh.RecalculateBounds();
                    objMesh.RecalculateNormals();
                    Destroy(temp.GetComponent<Collider>());
                    temp.AddComponent<BoxCollider>();
                }*/
            }

            // Add outline to object, which is used to show whether or not the object is selected
            //var outline = temp.AddComponent<Outline>();
            //outline.OutlineColor = new Color(0f, 0.141f, 1f);
            //outline.OutlineWidth = 1f;
            //outline.enabled = false;

            //populateOutliner(obj.name, temp);
            outliner.GetComponent<OutlinerManager>().addItem(temp);
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
    
    // Create a new object
    public void create(int selection)
    {
        switch (selection)
        {
            // Cube
            case 0:
                myPrefab = Resources.Load(prefabPath + "Cube") as GameObject;
                break;
            // Sphere
            case 1:
                myPrefab = Resources.Load(prefabPath + "Sphere") as GameObject;
                break;
            // Capsule
            case 2:
                myPrefab = Resources.Load(prefabPath + "Capsule") as GameObject;
                break;
            // Mesh
            case 3:
                break;
        }
        GameObject temp = Instantiate(myPrefab, new Vector3(0f,0f,0f), Quaternion.identity);
        temp.transform.localScale = new Vector3(10f, 10f, 10f);
        outliner.GetComponent<OutlinerManager>().addItem(temp);
    }

    public void create(OBJData data)
    {
        myPrefab = Resources.Load(prefabPath + "Mesh") as GameObject;
        GameObject temp = Instantiate(myPrefab, new Vector3(0f, 0f, 0f), Quaternion.identity);
        temp.transform.localScale = new Vector3(10f, 10f, 10f);
        outliner.GetComponent<OutlinerManager>().addItem(temp);

        MeshFilter objMesh = temp.GetComponent<MeshFilter>();

        //	Load the OBJ in
        //var lStream = new FileStream(modelPath + obj.mesh, FileMode.Open);
        //var meshObj = OBJLoader.LoadOBJ(lStream);
        objMesh.mesh.LoadOBJ(data);

        // Generate new collider
        Destroy(temp.GetComponent<Collider>());
        temp.AddComponent<BoxCollider>();
    }
}
