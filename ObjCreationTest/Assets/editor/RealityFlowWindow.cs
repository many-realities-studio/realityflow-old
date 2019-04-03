using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEditor;
using Assets.RealityFlow.Scripts.Events;

public class RealityFlowWindow : EditorWindow {

    Vector2 scrollPos = Vector2.zero;
    Texture2D headerSectionTexture;
    Texture2D bodySectionTexture;

    Color headerSectionColor = new Color(13f/255f, 32f/255f, 44f/255f, 1f);
    Color bodySectionColor = new Color(150/255f, 150/255f, 150/255f, 1f);

    Rect headerSection;
    Rect bodySection;

    bool loggedIn = false;

    GUISkin skin;

    int window = 0;

    string uName = "", pWord = "";

    string user = "Mago", pass = "12345";
    string projectName;

    static ObjectData objectData;

    private int timer = 2;
    private bool isManagerInit = false;

    public static ObjectData ObjectInfo { get { return objectData; } }

    // private void CallbackFunction()
    // {
    //     if (--timer <= 0)
    //     {
    //         //GameObject gm = GameObject.Find("Updater");
    //         GameObject gm = GameObject.FindGameObjectWithTag("ObjManager");

    //         if (gm != null && window == 2)
    //         {
    //             // List<GameObject> li = gm.GetComponent<ObjectManager>().GetFlowObjects();

    //             // foreach (GameObject o in li)
    //             // {
    //             //     o.GetComponent<FlowObject>().Update();
    //             // }
    //             // gm.GetComponent<FlowNetworkManager>().Update();
    //             // gm.GetComponent<FlowNetworkManager>().ProcessEditCommand();

    //             //gm.GetComponent<EditorUpdater>().Update();

    //             UnityEditorInternal.InternalEditorUtility.RepaintAllViews();
    //         }

    //        timer = 2;
    //     }
    // }

    [MenuItem("Window/Reality Flow")]
    static void OpenWindow()
    {
        RealityFlowWindow window = (RealityFlowWindow)GetWindow(typeof(RealityFlowWindow));
        //window.minSize = new Vector2(600, 300);
        window.Show();
    }


    // Simmilar to Awake or start
    private void OnEnable()
    {
        InitTextures();
        InitData();
        skin = Resources.Load<GUISkin>("guiStyles/RFSkin");
        CreateTag("ObjManager");
        //EditorApplication.update += CallbackFunction;
    }

    // void OnDisable()
    // {
    //     EditorApplication.update -= CallbackFunction;
    //     GameObject gm = GameObject.FindGameObjectWithTag("ObjManager");

    //     if (gm != null)
    //     {
    //         gm.GetComponent<FlowNetworkManager>().OnApplicationQuit();
    //     }
    // }

    private static void InitData()
    {
        objectData = (ObjectData)ScriptableObject.CreateInstance(typeof(ObjectData));
    }

    // Simmilar to update
    private void OnGUI()
    {
        if (!Config.userId.Equals("-9999") && loggedIn == false)
        {
            window = 1;
            pWord = "";
            uName = "";
            loggedIn = true;
        }
        DrawLayouts();
        DrawHeader();
        DrawBody();        
    }

    // Initializes the texture2d values
    private void InitTextures()
    {
        headerSectionTexture = new Texture2D(1, 1);
        headerSectionTexture.SetPixel(0, 0, headerSectionColor);
        headerSectionTexture.Apply();

        bodySectionTexture = new Texture2D(1, 1);
        bodySectionTexture.SetPixel(0, 0, bodySectionColor);
        bodySectionTexture.Apply();
    }

    private void DrawLayouts()
    {
        headerSection.x = 0;
        headerSection.y = 0;
        headerSection.width = Screen.width;
        headerSection.height = 50;

        bodySection.x = 0;
        bodySection.y = 50;
        bodySection.width = Screen.width;
        bodySection.height = Screen.width - 50;

        GUI.DrawTexture(headerSection, headerSectionTexture);
        GUI.DrawTexture(bodySection, bodySectionTexture);

    }

    private void DrawHeader()
    {
        GUILayout.BeginArea(headerSection);

        GUILayout.Label("Reality Flow", skin.GetStyle("Title"));

        GUILayout.EndArea();
    }

    private void DrawBody()
    {
        GUILayout.BeginArea(bodySection);
        scrollPos = EditorGUILayout.BeginScrollView(scrollPos, GUILayout.Width(275), GUILayout.Height(100));
        switch(window)
        {
            case 0:
                // login window
                EditorGUILayout.BeginHorizontal();
                GUILayout.Label("User: ");
                uName = EditorGUILayout.TextField(uName);
                EditorGUILayout.EndHorizontal();
                EditorGUILayout.BeginHorizontal();
                GUILayout.Label("Password: ");
                pWord = EditorGUILayout.TextField(pWord);
                EditorGUILayout.EndHorizontal();

                if (GUILayout.Button("Log in", GUILayout.Height(40)))
                {
					
					GameObject manager = GameObject.FindGameObjectWithTag("ObjManager");
					if ( manager == null)
					{
						manager = new GameObject("ObjManager");
						manager.tag = "ObjManager";
						manager.AddComponent(typeof(ObjectManager));
						manager.AddComponent(typeof(FlowNetworkManager));
                        manager.GetComponent<FlowNetworkManager>()._debug = false;
						manager.GetComponent<FlowNetworkManager>().LocalServer = Config.LOCAL_HOST;
						manager.GetComponent<FlowNetworkManager>().mainGameCamera = GameObject.FindGameObjectWithTag("MainCamera");
						manager.AddComponent(typeof(DoOnMainThread));
					}

                    // TODO: username and password for the real thing 
                    UserLoginEvent login = new UserLoginEvent();
                    login.Send(uName, pWord);
                }

                //Debug.Log(Config.userId);
                //if (Config.userId.Equals("-9999"))
                //{
                //    DrawBody();
                //}
                //else
                //{
                //    window = 1;
                //    pWord = "";
                //    uName = "";
                //    DrawBody();
                //}
                break;
            
            case 1:
            if (GUILayout.Button("Logout", GUILayout.Height(20)))
                {
                    // TODO: do logout
                    loggedIn = false;
                    Config.userId = "-9999";
                    window = 0;
                    Destroy(GameObject.FindGameObjectWithTag("ObjManager"));
                    DrawBody();
                }
                if (GUILayout.Button("New Project", GUILayout.Height(40)))
                {
                    window = 5;
                    DrawBody();
                }
                if (GUILayout.Button("Load Project", GUILayout.Height(40)))
                {
                    window = 4;
                    DrawBody();
                }
                break;
            case 2:
                if (GUILayout.Button("Exit Project", GUILayout.Height(20)))
                {
                    ExitProject();
                    window = 1;
                    DrawBody();
                }
                if (GUILayout.Button("Create new Object", GUILayout.Height(40)))
                {
                    ObjectSettings.OpenWindow();
                }
                if (GUILayout.Button("Delete an Object", GUILayout.Height(40)))
                {
                    window = 3;
                    DrawBody();
                }
                break;
            case 3:
                GameObject gm = GameObject.FindGameObjectWithTag("ObjManager");

                EditorGUILayout.BeginHorizontal();
                if (GUILayout.Button("Back", GUILayout.Height(20)))
                {
                    window = 2;
                    DrawBody();
                }
                EditorGUILayout.EndHorizontal();

                if (gm != null)
                {
                    List<GameObject> li = gm.GetComponent<ObjectManager>().GetFlowObjects();

                    foreach (GameObject c in li)
                    {
                        
                        if (GUILayout.Button(c.name, GUILayout.Height(30)))
                        {
                            // TODO: replace this with the delete object call
                            DeleteObject(c);
                        }
                    }
                }
                break;
            case 4:
                EditorGUILayout.BeginHorizontal();
                if (GUILayout.Button("Back", GUILayout.Height(20)))
                {
                    window = 1;
                    DrawBody();
                }
                EditorGUILayout.EndHorizontal();

                if (Config.projectList != null)
                {
                    // TODO: get the list of projects in some way or another
                    foreach (FlowProject c in Config.projectList)
                    {
                        if (GUILayout.Button(c.projectName, GUILayout.Height(30)))
                        {
                            Config.projectId = c._id;
                            ProjectFetchEvent fetch = new ProjectFetchEvent();
                            fetch.Send();
                            window = 2;
                            //DrawBody();
                        }
                    }
                }
                break;
            // project creation window
            case 5:
                EditorGUILayout.BeginHorizontal();
                GUILayout.Label("Project Name: ");
                projectName = EditorGUILayout.TextField(projectName);
                EditorGUILayout.EndHorizontal();

                if (projectName == null || projectName.Equals(""))
                {
                    EditorGUILayout.HelpBox("Enter a name for the project", MessageType.Warning);
                }
                else
                {
                    if (GUILayout.Button("Create Project", GUILayout.Height(40)))
                    {
                        // TODO: call create project 
                        ProjectCreateEvent create = new ProjectCreateEvent();
                        create.Send(projectName);

                        Debug.Log(Config.projectId);
                        if (Config.projectId.Equals("-9999"))
                        {
                            DrawBody();
                        }
                        else
                        {
                            window = 2;
                            projectName = "";
                            DrawBody();
                        }
                    }
                }
                break;
        }
        EditorGUILayout.EndScrollView();
        GUILayout.EndArea();
    }

    void DeleteObject(GameObject c)
    {
        // create json string
        ObjectDeleteEvent delete = new ObjectDeleteEvent();
        delete.Send(c.GetComponent<FlowTObject>()._id);
    }

    void ExitProject()
    {
        GameObject gm = GameObject.FindGameObjectWithTag("ObjManager");
        Config.projectId = "-9999";

        if (gm != null)
        {
            List<GameObject> li = gm.GetComponent<ObjectManager>().GetFlowObjects();

            foreach (GameObject c in li)
            {
                Destroy(c);
            }

            //Destroy(gm);
        }
    }

    void CreateTag (string s)
    {
        // Open tagManager
        SerializedObject tagManager = new SerializedObject(AssetDatabase.LoadAllAssetsAtPath("ProjectSettings/TagManager.asset")[0]);
        SerializedProperty tagsProp = tagManager.FindProperty("tags");

        // First check if it is not already present
        bool found = false;

        for (int i = 0; i < tagsProp.arraySize; i++)
        {
            SerializedProperty t = tagsProp.GetArrayElementAtIndex(i);
            if (t.stringValue.Equals(s)) { found = true; break; }
        }

        // if not found, add it
        if (!found)
        {
            tagsProp.InsertArrayElementAtIndex(0);
            SerializedProperty n = tagsProp.GetArrayElementAtIndex(0);
            n.stringValue = s;
            tagManager.ApplyModifiedPropertiesWithoutUndo();
        }
    }

}

public class ObjectSettings : EditorWindow
{
    static ObjectSettings window;

    public static void OpenWindow()
    {
        window = (ObjectSettings)GetWindow(typeof(ObjectSettings));
        window.minSize = new Vector2(200, 200);
        window.Show();
    }

    private void OnGUI()
    {
        DrawSettings((ObjectData)RealityFlowWindow.ObjectInfo);
    }

    void DrawSettings(ObjectData objData)
    {

        EditorGUILayout.BeginHorizontal();
        GUILayout.Label("Name");
        objData.objectName = EditorGUILayout.TextField(objData.objectName);
        EditorGUILayout.EndHorizontal();

        EditorGUILayout.BeginHorizontal();
        // GUILayout.Label("Prefab");
        // objData.prefab = (GameObject)EditorGUILayout.ObjectField(objData.prefab, typeof(GameObject), false);
        GUILayout.Label("Mesh");
        objData.mesh = (Mesh)EditorGUILayout.ObjectField(objData.mesh, typeof(Mesh), false);
        EditorGUILayout.EndHorizontal();

        objData.position = EditorGUILayout.Vector3Field("Position", objData.position);

        objData.rotation = EditorGUILayout.Vector3Field("Rotation", objData.rotation);

        objData.scale = EditorGUILayout.Vector3Field("Scale", objData.scale);

        // if (objData.prefab == null)
        // {
        //     EditorGUILayout.HelpBox("This object needs a [Prefab] before it can be created.", MessageType.Warning);
        // }
        if (objData.mesh == null)
        {
            EditorGUILayout.HelpBox("This object needs a [Mesh] before it can be created.", MessageType.Warning);
        }
        else if (objData.objectName == null || objData.objectName.Equals(""))
        {
            EditorGUILayout.HelpBox("This object needs a [Name] before it can be created.", MessageType.Warning);
        }
        // Add extra else if case to check if the name already exists in the project
        else
        {
            if (GUILayout.Button("Create", GUILayout.Height(30)))
            {
                SaveObjectData(objData);
                window.Close();
            }
        }
    }

    void SaveObjectData(ObjectData objData)
    {
        string prefabPath; //path to the base prefab
        string s = "ObjManager";

        // Check if there is already an object manager
        // if not, create one
        GameObject manager = GameObject.FindGameObjectWithTag(s);
        bool managerExists = true;

        if (manager == null)
        {
            manager = new GameObject("ObjManager");
            manager.tag = s;
            managerExists = false;
        }  

        // If the manager was just created add the necessary components
        if (managerExists == false)
        {
            manager.AddComponent(typeof(ObjectManager));
            manager.AddComponent(typeof(FlowNetworkManager));
            manager.GetComponent<FlowNetworkManager>().LocalServer = Config.LOCAL_HOST;
            manager.GetComponent<FlowNetworkManager>().mainGameCamera = GameObject.FindGameObjectWithTag("MainCamera");
            manager.AddComponent(typeof(DoOnMainThread));
        }

        FlowTObject obj = new FlowTObject();
        obj.vertices = RealityFlowWindow.ObjectInfo.mesh.vertices;
        obj.uv = RealityFlowWindow.ObjectInfo.mesh.uv;
        obj.triangles = RealityFlowWindow.ObjectInfo.mesh.triangles;
        obj.x = RealityFlowWindow.ObjectInfo.position.x;
        obj.y = RealityFlowWindow.ObjectInfo.position.y;
        obj.z = RealityFlowWindow.ObjectInfo.position.z;
        Quaternion rot = Quaternion.Euler(RealityFlowWindow.ObjectInfo.rotation);
        obj.q_x = rot.x;
        obj.q_y = rot.y;
        obj.q_z = rot.z;
        obj.q_w = rot.w;
        obj.s_x = RealityFlowWindow.ObjectInfo.scale.x;
        obj.s_y = RealityFlowWindow.ObjectInfo.scale.y;
        obj.s_z = RealityFlowWindow.ObjectInfo.scale.z;
        obj.type = "BoxCollider";
        obj.name = RealityFlowWindow.ObjectInfo.objectName;

        ObjectCreationEvent createObject = new ObjectCreationEvent();
        createObject.Send(obj);
    }
}


/// <summary>
/// Code for creating a prefab from info on the window is on video 13 
/// of the series Unity editor scripting on youtube from renaissance coders
/// timestamp: 8:54
/// </summary>
