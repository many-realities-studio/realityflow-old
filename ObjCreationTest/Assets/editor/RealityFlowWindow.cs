using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEditor;

public class RealityFlowWindow : EditorWindow {

    Vector2 scrollPos = Vector2.zero;
    Texture2D headerSectionTexture;
    Texture2D bodySectionTexture;

    Color headerSectionColor = new Color(13f/255f, 32f/255f, 44f/255f, 1f);
    Color bodySectionColor = new Color(150/255f, 150/255f, 150/255f, 1f);

    Rect headerSection;
    Rect bodySection;

    GUISkin skin;

    int window = 0;

    string uName = "", pWord = "";

    string user = "Mago", pass = "12345";

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
						manager.GetComponent<FlowNetworkManager>().LocalServer = Config.LOCAL_HOST;
						manager.GetComponent<FlowNetworkManager>().mainGameCamera = GameObject.FindGameObjectWithTag("MainCamera");
						manager.AddComponent(typeof(DoOnMainThread));
					}
					
                    if (uName.Equals(user) && pWord.Equals(pass))
                    {
                        FlowLoginCommand lEvent = new FlowLoginCommand();
                        lEvent.user = new User(uName, pWord);
                        FlowClient cl = new FlowClient();
                        cl.type = FlowNetworkManager.clientType;
                        lEvent.client = cl;
                        CommandProcessor.sendCommand(lEvent);
                    }

                    if (Config.userId.Equals("-9999"))
                    {
                        window = 1;
                        pWord = "";
                        uName = "";
                        DrawBody();
                    }
                }
                break;
            
            case 1:
            if (GUILayout.Button("Logout", GUILayout.Height(20)))
                {
                    window = 0;
                    Destroy(GameObject.FindGameObjectWithTag("ObjManager"));
                    DrawBody();
                }
                if (GUILayout.Button("New Project", GUILayout.Height(40)))
                {
                    window = 2;
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

                if (Config.projectList != null)
                {
                    // foreach (KeyValuePair<string, string> c in Config.projectList)
                    // {
                    //     if (GUILayout.Button(c.Value, GUILayout.Height(30)))
                    //     {
                    //         // load project()
                    //     }
                    // }

                    for (int i = 0; i < Config.projectList.Length; i++)
                    {
                        if (GUILayout.Button(Config.projectList[i].name, GUILayout.Height(30)))
                        {
                            // load project()
                        }
                    }
                }
                EditorGUILayout.EndHorizontal();
                break;
        }
        EditorGUILayout.EndScrollView();
        GUILayout.EndArea();
    }

    void DeleteObject(GameObject c)
    {
        // create json string
        string json = "";

        // send json string to server

        // delete game object locally
        FlowProject.activeProject.transformsById.Remove(c.GetComponent<FlowObject>().ft._id);
        Destroy(c);
    }

    void ExitProject()
    {
        GameObject gm = GameObject.FindGameObjectWithTag("ObjManager");

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

        // Get prefab path
        // prefabPath = AssetDatabase.GetAssetPath(RealityFlowWindow.ObjectInfo.prefab);

        // GameObject objPrefab = (GameObject)AssetDatabase.LoadAssetAtPath(prefabPath, typeof(GameObject));

        // objPrefab = Instantiate(objPrefab, RealityFlowWindow.ObjectInfo.position, 
        //     Quaternion.Euler( RealityFlowWindow.ObjectInfo.rotation.x, RealityFlowWindow.ObjectInfo.rotation.y, RealityFlowWindow.ObjectInfo.rotation.z));

        GameObject objPrefab = GameObject.CreatePrimitive(PrimitiveType.Cube);
        Mesh objMesh = objPrefab.GetComponent<MeshFilter>().mesh;
        objMesh.vertices = RealityFlowWindow.ObjectInfo.mesh.vertices;
        objMesh.uv = RealityFlowWindow.ObjectInfo.mesh.uv;
        objMesh.triangles = RealityFlowWindow.ObjectInfo.mesh.triangles;
        objMesh.RecalculateBounds();
        objMesh.RecalculateNormals();
        objPrefab.transform.localPosition = RealityFlowWindow.ObjectInfo.position;
        objPrefab.transform.localRotation = Quaternion.Euler(RealityFlowWindow.ObjectInfo.rotation);
        Destroy(objPrefab.GetComponent<Collider>());
        objPrefab.AddComponent<BoxCollider>();
        //objPrefab.GetComponent<BoxCollider>().isTrigger = true;

        // Set the new flowObject as a child of the object manager
        objPrefab.transform.SetParent(manager.transform);
        objPrefab.name = RealityFlowWindow.ObjectInfo.objectName;
        objPrefab.transform.localScale = RealityFlowWindow.ObjectInfo.scale;

        objPrefab.AddComponent(typeof(FlowObject));
        objPrefab.GetComponent<FlowObject>().Start();
        objPrefab.GetComponent<FlowObject>().ft._id = "1";
        objPrefab.GetComponent<FlowObject>().ft.id = "1";
        FlowProject.activeProject.RegObj();

        // If the manager was just created add the necessary components
        if (managerExists == false)
        {
            manager.AddComponent(typeof(ObjectManager));
            manager.AddComponent(typeof(FlowNetworkManager));
            manager.GetComponent<FlowNetworkManager>().LocalServer = Config.LOCAL_HOST;
            manager.GetComponent<FlowNetworkManager>().mainGameCamera = GameObject.FindGameObjectWithTag("MainCamera");
            manager.AddComponent(typeof(DoOnMainThread));

            // GameObject child = GameObject.CreatePrimitive(PrimitiveType.Cube);
            // child.AddComponent<EditorUpdater>();
            // child.name = "Updater";
            // child.transform.SetParent(manager.transform);
            // child.transform.position = new Vector3(1000,1000,0);

            // manager.GetComponent<FlowNetworkManager>().Awake();
            // manager.GetComponent<FlowNetworkManager>().Start();
        }

        // Clear all fields in the settings window
        objData.objectName = "";
        objData.prefab = null;
        objData.mesh = null;
        objData.position = new Vector3(0, 0, 0);
        objData.rotation = new Vector3(0, 0, 0);
        objData.scale = new Vector3(1, 1, 1);

        CreateFlowObjectCommand fEvent = new CreateFlowObjectCommand();
        //create json and send to server
        jsonObject obj = new jsonObject();
        Mesh mesh = objPrefab.GetComponent<MeshFilter>().mesh;
        obj.vertices = mesh.vertices;
        obj.uv = mesh.uv;
        obj.triangles = mesh.triangles;
        obj.type = objPrefab.GetComponent<Collider>().GetType().Name; // BoxCollider
        obj.x = objPrefab.transform.localPosition.x;
        obj.y = objPrefab.transform.localPosition.y;
        obj.z = objPrefab.transform.localPosition.z;
        obj.s_x = objPrefab.transform.localScale.x;
        obj.s_y = objPrefab.transform.localScale.y;
        obj.s_z = objPrefab.transform.localScale.z;
        obj.q_x = objPrefab.transform.localRotation.x;
        obj.q_y = objPrefab.transform.localRotation.y;
        obj.q_z = objPrefab.transform.localRotation.z;
        obj.q_w = objPrefab.transform.localRotation.w;
        obj.objectName = objPrefab.name;
        obj.id = objPrefab.GetComponent<FlowObject>().ft.id;
        obj._id = objPrefab.GetComponent<FlowObject>().ft._id;
        fEvent.obj = obj;
        CommandProcessor.sendCommand(fEvent);
        //obj.id = "";
        //string json = JsonUtility.ToJson(obj);
        //Debug.Log(json);

        // //Testing The Json object
        // jsonObject ret = new jsonObject();
        // JsonUtility.FromJsonOverwrite(json, ret);
        // GameObject oo = GameObject.CreatePrimitive(PrimitiveType.Cube);
        // Mesh newMesh = oo.GetComponent<MeshFilter>().mesh;
        // newMesh.vertices = ret.vertices;
        // newMesh.uv = ret.uv;
        // newMesh.triangles = ret.triangles;
        // newMesh.RecalculateBounds();
        // newMesh.RecalculateNormals();
        // oo.transform.localPosition = new Vector3(ret.x + 3, ret.y, ret.z);
        // oo.transform.localScale = new Vector3(ret.s_x, ret.s_y, ret.s_z);
        // oo.transform.localRotation = Quaternion.Euler(new Vector4(ret.q_x, ret.q_y, ret.q_z, ret.q_w));
        // oo.name = ret.objectName;
        // oo.AddComponent<FlowObject>();
        // //oo.GetComponent<FlowObject>().ft.id = ret.id;
        // Destroy(oo.GetComponent<Collider>());
    
        // switch (ret.type)
    	// {
    	// 	case "BoxCollider":
        // 	oo.AddComponent<BoxCollider>();
        // 		break;
    	// 	case "CapsuleCollider":
    	// 	oo.AddComponent<CapsuleCollider>();
        // 		break;
        // 	case "SphereCollider":
    	// 	oo.AddComponent<SphereCollider>();
    	// 		break;
        // 	case "MeshCollider":
        // 	oo.AddComponent<MeshCollider>();
    	// 		break;
    	// }
    }
}


/// <summary>
/// Code for creating a prefab from info on the window is on video 13 
/// of the series Unity editor scripting on youtube from renaissance coders
/// timestamp: 8:54
/// </summary>
