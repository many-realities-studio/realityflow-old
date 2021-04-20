using MobileConfiguration;
using Packages.realityflow_package.Runtime.scripts;
using RealityFlow.Plugin.Scripts;
using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.SceneManagement;
using UnityEngine.UI;
using Config = MobileConfiguration.Config;

public class UserHubManager : MonoBehaviour
{
    public GameObject newProjectEntryField;
    public GameObject joinProjectField;

    public Dictionary<string, FlowProject> listOfProjects;
    public GameObject ProjectPanelPrefab;
    Dictionary<string, FlowProject>.ValueCollection values;
    private List<ProjectListItem> projectListEntries;
    public Transform content;
    private const int BUILD_SETTING_MOBILE_INTERFACE = 1;
    List<FlowProject> userProjects = null;

    // Start is called before the first frame update
    void Start()
    {
        if (userProjects == null)
        {
            userProjects = new List<FlowProject>();
        }
        // Debug.Log("User hub starting");
        RefreshProjectList();
        //Update();

        if(Config.LeftProject == true)
        {
            Config.LeftProject = false;
            RefreshProjectList();
        }

        
        //GenerateProjectList();
        //CreateProjectListItems();        
    }


    /// <summary>
    /// Adds the user's list of projects and ID's to the dictionary
    /// </summary>
    private void GenerateProjectList()
    {

        if(userProjects == null)
        {
            Debug.Log("No projects");
            return;
        }

        listOfProjects = new Dictionary<string, FlowProject>();

        foreach (FlowProject project in userProjects)
        {
            listOfProjects.Add(project.Id, project);
        }

        values = listOfProjects.Values;
    }

    // Function that creates the project list for a user.
    private void CreateProjectListItems()
    {
        projectListEntries = new List<ProjectListItem>();

        for (int i = 0; i < content.transform.childCount; i++)
        {
            Destroy(content.transform.GetChild(i).gameObject);
        }

        foreach (FlowProject p in values)
        {
            GameObject newItem = Instantiate(ProjectPanelPrefab) as GameObject;
            ProjectListItem item = newItem.GetComponent<ProjectListItem>();
            Text entryName = newItem.GetComponentInChildren<Text>();
            projectListEntries.Add(item);
            entryName.text = p.ProjectName;
            newItem.transform.SetParent(content.transform);
            newItem.transform.localScale = Vector3.one;

            if (item != null)
            {
                item.projectName = p.ProjectName;
                item.id = p.Id;
                item.manager = this;
                item.index = projectListEntries.Count - 1;
            }
        }
    }



    /// <summary>
    /// Sends a request to server to fetch all user's projects
    /// </summary>
    private void RefreshProjectList()
    {
        if(userProjects == null)
        {
            userProjects = Config.projects;
            GenerateProjectList();
            CreateProjectListItems();
        }
        else
        {
            Operations.GetAllUserProjects(ConfigurationSingleton.SingleInstance.CurrentUser, (_, e) =>
            {
                Config.projects = userProjects = e.message.Projects;
                GenerateProjectList();
                CreateProjectListItems();

            });
        }
    }



    /// <summary>
    /// Sends a request to server to create a new project and refreshes the 
    /// project list.
    /// </summary>
    public void CreateProject()
    {
        string projectName = newProjectEntryField.GetComponent<InputField>().text;

        ConfigurationSingleton.SingleInstance.CurrentProject = new FlowProject("", "", 0, projectName);

        Operations.CreateProject(ConfigurationSingleton.SingleInstance.CurrentProject, ConfigurationSingleton.SingleInstance.CurrentUser, (_, e) =>
        {
            if(e.message.WasSuccessful == true)
            {
                RefreshProjectList();
            }
        });
    }



    /// <summary>
    /// Sends a request to the server to join a project. If successful, 
    /// user is directed to the project hub page.
    /// </summary>
    public void JoinProject()
    {
        string projectId = joinProjectField.GetComponent<InputField>().text;

        Operations.OpenProject(projectId, ConfigurationSingleton.SingleInstance.CurrentUser, (_, e) =>
        {
            if(e.message.WasSuccessful == true)
            {
                Config.ProjectToLoadId = projectId;
                SceneManager.LoadScene(BUILD_SETTING_MOBILE_INTERFACE);
            }

            else
            {
                Debug.Log("Unable to join project.");
            }

        });
    }

    public void selectProject(ProjectListItem item)
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

                
                    Config.ProjectToLoadId = item.id;
                    SceneManager.LoadScene(BUILD_SETTING_MOBILE_INTERFACE);
                    break;
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
