using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEditor;
using Assets.RealityFlow.Scripts.Events;
using System.IO;
public class RealityFlowWindow : EditorWindow {

    Vector2 scrollPos = Vector2.zero;
    Texture2D headerSectionTexture;
    public static bool testBool = false;
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

    string toInv = "";
    string projectName;

    static ObjectData objectData;

    private int timer = 2;
    private bool isManagerInit = false;

    public static ObjectData ObjectInfo { get { return objectData; } }

    [MenuItem("Window/Reality Flow")]
    static void OpenWindow()
    {
        RealityFlowWindow window = (RealityFlowWindow)GetWindow(typeof(RealityFlowWindow));
        window.Show();
    }


    // Simmilar to Awake or start
    private void OnEnable()
    {
        InitTextures();
        InitData();
        skin = Resources.Load<GUISkin>("guiStyles/RFSkin");
        CreateTag("ObjManager");
        CreateTag("imported");
    }

    private static void InitData()
    {
        objectData = (ObjectData)ScriptableObject.CreateInstance(typeof(ObjectData));
    }

    // Simmilar to update
    private void OnGUI()
    {
        DrawLayouts();
        DrawHeader();
        DrawBody();        
    }

    // Login Check
    void Update()
    {
        if ((!Config.userId.Equals("-9999") && !Config.userId.Equals("")) && loggedIn == false)
        {
            window = 1;
            pWord = "";
            uName = "";
            loggedIn = true;
            Repaint();
        }
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

    // Define the layout of the sections
    private void DrawLayouts()
    {
        headerSection.x = 0;
        headerSection.y = 0;
        headerSection.width = Screen.width/2;
        // Debug.Log(Screen.width);
        headerSection.height = 50;

        bodySection.x = 0;
        bodySection.y = 50;
        bodySection.width = Screen.width/2;
        bodySection.height = Screen.height - 50;

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
        scrollPos = EditorGUILayout.BeginScrollView(scrollPos, GUILayout.Width(Screen.width/2), GUILayout.Height(Screen.height - 70));
        switch(window)
        {
            case 0: // login window
                EditorGUILayout.BeginHorizontal();
                GUILayout.Label("User: ");
                uName = EditorGUILayout.TextField(uName);
                EditorGUILayout.EndHorizontal();
                EditorGUILayout.BeginHorizontal();
                GUILayout.Label("Password: ");
                pWord = EditorGUILayout.PasswordField(pWord);
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

                    UserLoginEvent login = new UserLoginEvent();
                    login.Send(uName, pWord, FlowClient.CLIENT_EDITOR);
                }

                if (GUILayout.Button("Register", GUILayout.Height(30)))
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

                    UserRegisterEvent register = new UserRegisterEvent();
                    register.Send(uName, pWord, FlowClient.CLIENT_EDITOR);
                }

                if (GUILayout.Button("Import", GUILayout.Height(20)))
                {
                    window = 7;
                    DrawBody();
                }

                break;
            
            case 1: // User Hub
            if (GUILayout.Button("Logout", GUILayout.Height(20)))
                {
                    UserLogoutEvent logout = new UserLogoutEvent();
                    logout.Send();

                    loggedIn = false;
                    Config.userId = "-9999";
                    window = 0;
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
            case 2: // Project Hub
                if (GUILayout.Button("Exit Project", GUILayout.Height(20)))
                {
                    ExitProject(); // Deletes all local instances of the objects and restores the projectID to default value
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
                // This piece of code would take you to the invite user window but the functionality
                // is not up on the current server
                //-------------------------------------------------------------//
                // if (GUILayout.Button("Invite User", GUILayout.Height(30)))
                // {
                //     window = 6;
                //     DrawBody();
                // }
                //-------------------------------------------------------------//
                if (GUILayout.Button("Export", GUILayout.Height(20)))
                {
                    ConfirmationWindow.OpenWindow();
                }
                break;
            case 3: // Delete Object
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
                            DeleteObject(c);
                        }
                    }
                }
                break;
            case 4: // Load Project
                EditorGUILayout.BeginHorizontal();
                if (GUILayout.Button("Back", GUILayout.Height(20)))
                {
                    window = 1;
                    DrawBody();
                }
                EditorGUILayout.EndHorizontal();

                if (Config.projectList != null)
                {
                    foreach (FlowProject c in Config.projectList)
                    {
                        if (GUILayout.Button(c.projectName, GUILayout.Height(30)))
                        {
                            Config.projectId = c._id;
                            FlowProject.activeProject.projectName = c.projectName;
                            ProjectFetchEvent fetch = new ProjectFetchEvent();
                            fetch.Send();
                            window = 2;
                        }
                    }
                }
                break;
            case 5: // project creation window
                EditorGUILayout.BeginHorizontal();
                if (GUILayout.Button("Back", GUILayout.Height(20)))
                {
                    window = 1;
                    DrawBody();
                }
                EditorGUILayout.EndHorizontal();

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
                        ProjectCreateEvent create = new ProjectCreateEvent();
                        create.Send(projectName);

                        window = 2;
                        projectName = "";
                        DrawBody();
                    }
                }
                break;
            case 6: // Invite User --- User invites are not currently supported on the live server
                EditorGUILayout.BeginHorizontal();
                if (GUILayout.Button("Back", GUILayout.Height(20)))
                {
                    window = 2;
                    DrawBody();
                }
                EditorGUILayout.EndHorizontal();

                EditorGUILayout.BeginHorizontal();
                GUILayout.Label("Username: ");
                toInv = EditorGUILayout.TextField(toInv);
                EditorGUILayout.EndHorizontal();

                if (toInv == null || toInv.Equals(""))
                {
                    EditorGUILayout.HelpBox("Enter the username of the person to invite", MessageType.Warning);
                }
                else
                {
                    if (GUILayout.Button("Invite", GUILayout.Height(40)))
                    {
                        ProjectInviteEvent inv = new ProjectInviteEvent();
                        inv.send(toInv);
                        window = 2;
                        DrawBody();
                    }
                }
                break;
            case 7: // Project Import
                
                EditorGUILayout.BeginHorizontal();
                if (GUILayout.Button("Back", GUILayout.Height(20)))
                {
                    window = 0;
                    DrawBody();
                }
                EditorGUILayout.EndHorizontal();

                string path = "Assets/resources/projects/test.txt";

                StreamReader reader = new StreamReader(path);
                List<string> jsons = new List<string>();

                while (reader.Peek() != -1)
                {
                    jsons.Add(reader.ReadLine());
                }
                reader.Close();
                
                foreach (string json in jsons)
                {
                    ProjectFetchEvent log = new ProjectFetchEvent();
                    JsonUtility.FromJsonOverwrite(json, log);
                    string date = new System.DateTime(log.timestamp).ToString();
                    if (GUILayout.Button(log.project.projectName + "   " + date, GUILayout.Height(30)))
                    {
                        // gather the list of objects in the previous imported project
                        GameObject[] list = GameObject.FindGameObjectsWithTag("imported");

                        // clear any previous imported objects
                        foreach (GameObject oo in list)
                        {
                            DestroyImmediate(oo);
                        }

                        foreach (FlowTObject obj in log.objs)
                        {
                            // this piece of code doesn't have textures implemented
                            // for an example on how to add the textures look at the commented
                            // code in the SaveObjectData function

                            Debug.Log("creating object: " + obj.name);
                            GameObject newObj = GameObject.CreatePrimitive(PrimitiveType.Cube);

                            Mesh objMesh = newObj.GetComponent<MeshFilter>().mesh;
                            objMesh.vertices = obj.vertices;
                            objMesh.uv = obj.uv;
                            objMesh.triangles = obj.triangles;
                            objMesh.RecalculateBounds();
                            objMesh.RecalculateNormals();
                            newObj.transform.localPosition = new Vector3(obj.x, obj.y, obj.z);
                            newObj.transform.localRotation = Quaternion.Euler(new Vector4(obj.q_x, obj.q_y, obj.q_z, obj.q_w));
                            newObj.transform.localScale = new Vector3(obj.s_x, obj.s_y, obj.s_z);
                            MonoBehaviour.DestroyImmediate(newObj.GetComponent<Collider>(), true);
                            newObj.AddComponent<BoxCollider>();
                            newObj.name = obj.name;
                            newObj.tag = "imported";
                            Material mat = newObj.GetComponent<MeshRenderer>().material;
                            mat.color = obj.color;
                        }

                        window = 0;
                        DrawBody();
                    }
                }

                break;
        }
        EditorGUILayout.EndScrollView();
        GUILayout.EndArea();
    }

    void DeleteObject(GameObject c)
    {
        ObjectDeleteEvent delete = new ObjectDeleteEvent();
        delete.Send(c.GetComponent<FlowObject>().ft._id);
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

            // Reset transform lists
            FlowProject.activeProject.transformsById = new Dictionary<string, FlowTObject>();
            FlowProject.activeProject.transforms = new List<FlowTObject>();
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

public class ConfirmationWindow : EditorWindow
{
    static ConfirmationWindow window;

    public static void OpenWindow()
    {
        window = (ConfirmationWindow)GetWindow(typeof(ConfirmationWindow));
        window.minSize = new Vector2(200, 50);
        window.maxSize = new Vector2(200, 50);
        window.Show();
    }

    private void OnGUI()
    {
        DrawConfirm();
    }

    void DrawConfirm()
    {
        GUILayout.Label("Do you want to keep a \nlocal copy of this project?");

        EditorGUILayout.BeginHorizontal();
        if (GUILayout.Button("Confirm", GUILayout.Height(20)))
        {
            ProjectFetchEvent project = new ProjectFetchEvent();
            project.project = new FlowProject(Config.projectId);
            project.objs = new List<FlowTObject>();
            project.project.projectName = FlowProject.activeProject.projectName;
            project.timestamp = System.DateTime.Now.Ticks;

            foreach (FlowTObject obj in FlowProject.activeProject.transformsById.Values)
            {
                obj.Read();
                project.objs.Add(obj);
            }

            string path2 = "Assets/resources/projects/test.txt";

            StreamWriter writer = new StreamWriter(path2, true);
            writer.WriteLine(JsonUtility.ToJson(project));
            writer.Close();

            window.Close();
        }
        if (GUILayout.Button("Cancel", GUILayout.Height(20)))
        {
            window.Close();
        }
        EditorGUILayout.EndHorizontal();
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
        GUILayout.Label("Mesh");
        objData.mesh = (Mesh)EditorGUILayout.ObjectField(objData.mesh, typeof(Mesh), false);
        EditorGUILayout.EndHorizontal();

        // Textures are currently not supported on the live server due to lag issues
        //-----------------------------------------------------------------------------------------------------
        // EditorGUILayout.BeginHorizontal();
        // GUILayout.Label("Texture");
        // objData.texture = (Texture2D)EditorGUILayout.ObjectField(objData.texture, typeof(Texture2D), false);
        // EditorGUILayout.EndHorizontal();
        //-----------------------------------------------------------------------------------------------------

        objData.position = EditorGUILayout.Vector3Field("Position", objData.position);

        objData.rotation = EditorGUILayout.Vector3Field("Rotation", objData.rotation);

        objData.scale = EditorGUILayout.Vector3Field("Scale", objData.scale);

        objData.color = EditorGUILayout.ColorField("Color", objData.color);

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
                SetupObjectManager();
                SaveObjectData(objData);
                window.Close();
            }
        }
    }

    void SetupObjectManager()
    {
        // string prefabPath; //path to the base prefab
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
    }

    public static void SaveObjectData(ObjectData objectData)
    {

        FlowTObject obj = new FlowTObject();

        obj.vertices = objectData.mesh.vertices;
        obj.uv = objectData.mesh.uv;
        obj.triangles = objectData.mesh.triangles;
        obj.x = objectData.position.x;
        obj.y = objectData.position.y;
        obj.z = objectData.position.z;


        Quaternion rot = Quaternion.Euler(objectData.rotation);
        obj.q_x = rot.x;
        obj.q_y = rot.y;
        obj.q_z = rot.z;
        obj.q_w = rot.w;

        obj.s_x = objectData.scale.x;
        obj.s_y = objectData.scale.y;
        obj.s_z = objectData.scale.z;

        obj.type = "BoxCollider";
        obj.name = objectData.objectName;
        obj.color = objectData.color;

        // Textures are currently not supported on the live server due to lag
        //-------------------------------------------------------------------------
        // obj.texture = RealityFlowWindow.ObjectInfo.texture.GetRawTextureData();
        // obj.textureHeight = RealityFlowWindow.ObjectInfo.texture.height;
        // obj.textureWidth = RealityFlowWindow.ObjectInfo.texture.width;
        // obj.textureFormat = (int)RealityFlowWindow.ObjectInfo.texture.format;
        // obj.mipmapCount = RealityFlowWindow.ObjectInfo.texture.mipmapCount;
        //-------------------------------------------------------------------------

        ObjectCreationEvent createObject = new ObjectCreationEvent();
        createObject.Send(obj);
    }
}