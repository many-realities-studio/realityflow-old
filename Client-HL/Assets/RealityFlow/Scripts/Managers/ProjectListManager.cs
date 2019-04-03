using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using UnityEngine.SceneManagement;
using System.IO;

public class ProjectListManager : MonoBehaviour {

    private const string dataFileName = "testProjectList.json";
    private bool populated;
    public ProjectDataList projects = new ProjectDataList();
    public GameObject ProjectPanelPrefab;
    public Transform content;
    List<ProjectListItem> projectListEntries;

    private void Start()
    {
        //LoadJSON();
        projectListEntries = new List<ProjectListItem>();
        populated = false;
    }

    private void Update()
    {

        if (!populated && Config.projectList != null && Config.projectList.Count > 0)
        {
            foreach (FlowProject p in Config.projectList)
            {
                GameObject newItem = Instantiate(ProjectPanelPrefab) as GameObject;
                ProjectListItem item = newItem.GetComponent<ProjectListItem>();
                Text entryName = newItem.GetComponentInChildren<Text>();
                projectListEntries.Add(item);
                entryName.text = p.projectName;
                newItem.transform.SetParent(content.transform);
                newItem.transform.localScale = Vector3.one;

                if (item != null)
                {
                    item.name = p.projectName;
                    item.id = p._id;
                    item.manager = this;
                    item.index = projectListEntries.Count - 1;
                }
            }
            populated = true;
        }
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
                projects = JsonUtility.FromJson<ProjectDataList>(rawJSON);
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
    public void select(ProjectListItem item)
    {
        for (int i = 0; i < projectListEntries.Count; i++)
        {
            toggleButton toggle = projectListEntries[i].GetComponent<toggleButton>();
            if (toggle != null)
            {
                if (i == item.index && !toggle.IsPressed)
                {
                    // select it!
                    toggle.changeState();
                    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                    // !!!                                             !!!
                    // !!!   THIS IS WHERE YOU WILL LOAD THE PROJECT   !!!
                    // !!!                                             !!!
                    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                    Config.projectId = projectListEntries[i].id;
                    SceneManager.LoadScene(1);
                }
                else if (toggle.IsPressed)
                {
                    // deselect it!
                    toggle.changeState();
                }
            }
        }
    }
}
