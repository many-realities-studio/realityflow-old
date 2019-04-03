using System.Collections;
using System.Collections.Generic;
using System.IO;
using UnityEngine;
using UnityEngine.UI;
using UnityExtension;

public class MeshListManager : MonoBehaviour
{

    public GameObject MeshPanelPrefab;
    public Transform content;
    public ObjectManager objManager;
    private const string modelPath = "Assets/Resources/Models/";
    private string path;

    // List of .obj files in the project
    Dictionary <string, OBJData> objList;
    // List of entries in the mesh list window
    List<MeshListItem> meshListEntries;

    private void Start()
    {
        meshListEntries = new List<MeshListItem>();

        objList = new Dictionary<string, OBJData>();
        path = Application.dataPath + "/Resources/Models";
        var info = new DirectoryInfo(path);
        var fileInfo = info.GetFiles("*.obj");
        foreach (var file in fileInfo)
        {
            var lStream = new FileStream(modelPath + file.Name, FileMode.Open);
            var meshObj = OBJLoader.LoadOBJ(lStream);
            objList.Add(file.Name, meshObj);

            lStream.Close();
            lStream = null;
            meshObj = null;
        }

        // Create panels and add them to the scrollview
        foreach (string key in objList.Keys)
        {
            //Debug.Log(key);
            addItem(key);
        }
    }

    // Adds item to scrollview in UI
    public void addItem(string key)
    {
        OBJData model = objList[key];
        GameObject newItem = Instantiate(MeshPanelPrefab) as GameObject;
        MeshListItem item = newItem.GetComponent<MeshListItem>();
        Text entryName = newItem.GetComponentInChildren<Text>();
        meshListEntries.Add(item);
        entryName.text = key;
        newItem.transform.SetParent(content.transform);
        newItem.transform.localScale = Vector3.one;

        if (item != null)
        {
            // populate variables
            item.name = name;
            item.manager = this;
            item.model = objList[key];
            item.index = meshListEntries.Count - 1;
        }
        else
        {
            // error
            Debug.Log("New item " + name + " does not have MeshListItem component in addItem().");
        }
    }

    public void select(MeshListItem item)
    {
        for(int i = 0; i < meshListEntries.Count; i++)
        {
            toggleButton toggle = meshListEntries[i].GetComponent<toggleButton>();
            if (toggle != null)
            {
                if (i == item.index && !toggle.IsPressed)
                {
                    // select it!
                    toggle.changeState();
                }
                else if (toggle.IsPressed)
                {
                    // deselect it!
                    toggle.changeState();
                }
            }
        }
    }

    public void create()
    {
        // Find first selected item and pass it to object creation in the object
        // manager
        for (int i = 0; i < meshListEntries.Count; i++)
        {
            toggleButton toggle = meshListEntries[i].GetComponent<toggleButton>();
            if (toggle != null && toggle.IsPressed)
            {
                objManager.create(meshListEntries[i].model);
            }
        }
    }
}
