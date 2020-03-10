using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using UnityEngine.SceneManagement;
using RealityFlow.Plugin.Scripts;
//using RealityFlow.Plugin.Scripts.Events;
using System;


// This file contains the functions used to populate and maintain the projects list.
// It also holds the functions used to manage the window used to create or join a
// project. All functions associated with this window are prefixed with "newProject".

public class ProjectListManager : MonoBehaviour {

    private bool populated;
    //private bool createPending;
    public ProjectDataList projects/* = new ProjectDataList()*/;
    public GameObject ProjectPanelPrefab;
    public Transform content;
    List<ProjectListItem> projectListEntries;

    // constants
    private const string PROJ_WINDOW = "CreateJoinWindow";
    private const string CREATE_PROJECT = "CreateProjectPanel";
    private const string JOIN_PROJECT = "JoinProjectPanel";
    private const string SELECT_PANEL = "SelectPanel";
    private const string NEW_PROJ_TEXT = "NewProjectEntry";
    private const string ENTRY_TEXT = "Text";
    private const string PROJECT_UNSET = "-9996";            // sentinel value used to indicate no project creation, join, or load
                                                             // calls are pending
    private const string PROJECT_CREATE_WAITING = "-9997";   // sentinel value used to indicate a project creation is pending
    private const string PROJECT_JOIN_WAITING = "-9998";     // sentinel value used to indicate a project join is pending
    private const int SELECT_MENU = 0;
    private const int CREATE_MENU = 1;
    private const int JOIN_MENU = 2;
    private const int BUILD_SETTING_MOBILE_INTERFACE = 1;

    // form variables
    //private Text entry;
    private GameObject activePanel;

    public Text greeting;
    public bool usernameSet = false;

    public void Awake()
    {
        Start();    
    }

    private void Start()
    {
        ProjectDataList projects = new ProjectDataList();
        projectListEntries = new List<ProjectListItem>();
        populated = false;
        Config.projectId = PROJECT_UNSET;
    }

    public void OnEnable()
    {
        // let update function know that username has been previously set
        usernameSet = true;
        setGreeting(Config.username);
    }

    public void OnDisable()
    {
        // user is logging out, reset all variables
        usernameSet = false;
        populated = false;
        projectListEntries.Clear();

        // clear the project list items 
        List<GameObject> list = new List<GameObject>();
        for (int i = 0; i < content.transform.childCount; i++)
        {
            Destroy(content.transform.GetChild(i).gameObject);
        }
    }

    public void setGreeting(string name)
    {
        greeting = GameObject.Find("Greeting").GetComponent<Text>();
        greeting.text = "Hello " + name + "!";
    }

    private void Update()
    {

        // prevents the greeting from displaying the previous logged in user's name 
        if (usernameSet && Config.username != "")
        {
            setGreeting(Config.username);
            usernameSet = false;
        }

        if (!populated && Config.projectList != null && Config.projectList.Count > 0)
        {
            // Populate project list
            foreach (FlowProject p in Config.projectList)
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
        
         
            content.transform.parent.transform.parent.gameObject.GetComponent<ScrollRect>().verticalNormalizedPosition = 1f;
            populated = true;
        }

        // If the project Id has been set, then load the project with that Id.
        if (Config.projectId != PROJECT_UNSET)
        {
            //SceneManager.LoadScene(BUILD_SETTING_MOBILE_INTERFACE);
            //Debug.Log(Config.projectId);
            //Config.projectId = PROJECT_UNSET;
        }
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
                    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                    // !!!                                             !!!
                    // !!!   THIS IS WHERE YOU WILL LOAD THE PROJECT   !!!
                    // !!!                                             !!!
                    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                    Config.projectId = projectListEntries[i].id;
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

    public void newProjectOpen()
    {
        // Find the new project window and enable it
        Transform window = transform.parent.Find(PROJ_WINDOW);
        window.gameObject.SetActive(true);

        // Initialize active panel to the selection menu
        activePanel = window.Find(SELECT_PANEL).gameObject;
    }

    public void newProjectClose()
    {
        // Find the new project window and enable it
        Transform window = transform.parent.Find(PROJ_WINDOW);
        window.gameObject.SetActive(false);

        // Reset the active panel to null
        activePanel = null;
    }

    public void newProjectSelect(int selection)
    {
        // Initialize variables for new project window, project creation menu, and project
        // join menu
        Transform window = transform.parent.Find(PROJ_WINDOW);
        Transform select = window.Find(SELECT_PANEL);
        Transform create = window.Find(CREATE_PROJECT);
        Transform join = window.Find(JOIN_PROJECT);

        // Open a different project entry depending on the button the user pressed
        switch (selection)
        {
            // (Safely) disable the active menu and show the form for creating a project
            case (SELECT_MENU):
                if (activePanel != null) activePanel.SetActive(false);
                select.gameObject.SetActive(true);
                activePanel = select.gameObject;
                break;
            // (Safely) disable the active menu and show the form for creating a project
            case (CREATE_MENU):
                if (activePanel != null) activePanel.SetActive(false);
                create.gameObject.SetActive(true);
                activePanel = create.gameObject;
                break;
            // (Safely) disable the selection menu and show the form for joining a project
            case (JOIN_MENU):
                if (activePanel != null) activePanel.SetActive(false);
                join.gameObject.SetActive(true);
                activePanel = join.gameObject;
                break;
        }
    }

    // Create new project
    public void createProject()
    {
        // Initialize variables for new project window and project name field
        Transform window = transform.parent.Find(PROJ_WINDOW);
        Text entry = window.Find(CREATE_PROJECT).Find(NEW_PROJ_TEXT).Find(ENTRY_TEXT).gameObject.GetComponent<Text>();

        Config.projectId = PROJECT_CREATE_WAITING;
       // ProjectCreateEvent project = new ProjectCreateEvent();
        //project.Send(entry.text);
    }
}
