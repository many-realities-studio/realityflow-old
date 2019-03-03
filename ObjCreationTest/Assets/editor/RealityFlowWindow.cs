using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEditor;

public class RealityFlowWindow : EditorWindow {

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
                    if (uName.Equals(user) && pWord.Equals(pass))
                    {
                        window = 1;
                        DrawBody();
                    }
                }
                break;
            
            case 1:
                // GameObject gm = GameObject.FindGameObjectWithTag("ObjManager");

                // if (gm != null)
                // {
                //     List<GameObject> li = gm.GetComponent<ObjectManager>().GetFlowObjects();

                //     foreach (GameObject o in li)
                //     {
                //         o.GetComponent<FlowObject>().Start();
                //     }

                //     //gm.GetComponent<FlowNetworkManager>().Awake();
                //     gm.GetComponent<FlowNetworkManager>().Start();
                //     isManagerInit = true;
                // }
                window = 2;
                DrawBody();
                break;

            case 2:
                if (GUILayout.Button("Create new Object", GUILayout.Height(40)))
                {
                    ObjectSettings.OpenWindow();
                }
                break;
        }

        GUILayout.EndArea();
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
        GUILayout.Label("Prefab");
        objData.prefab = (GameObject)EditorGUILayout.ObjectField(objData.prefab, typeof(GameObject), false);
        EditorGUILayout.EndHorizontal();

        objData.position = EditorGUILayout.Vector3Field("Position", objData.position);

        objData.rotation = EditorGUILayout.Vector3Field("Rotation", objData.rotation);

        objData.scale = EditorGUILayout.Vector3Field("Scale", objData.scale);

        if (objData.prefab == null)
        {
            EditorGUILayout.HelpBox("This object needs a [Prefab] before it can be created.", MessageType.Warning);
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
        prefabPath = AssetDatabase.GetAssetPath(RealityFlowWindow.ObjectInfo.prefab);

        GameObject objPrefab = (GameObject)AssetDatabase.LoadAssetAtPath(prefabPath, typeof(GameObject));

        objPrefab = Instantiate(objPrefab, RealityFlowWindow.ObjectInfo.position, 
            Quaternion.Euler( RealityFlowWindow.ObjectInfo.rotation.x, RealityFlowWindow.ObjectInfo.rotation.y, RealityFlowWindow.ObjectInfo.rotation.z));

        // Set the new flowObject as a child of the object manager
        objPrefab.transform.SetParent(manager.transform);
        objPrefab.name = RealityFlowWindow.ObjectInfo.objectName;
        objPrefab.transform.localScale = RealityFlowWindow.ObjectInfo.scale;

        objPrefab.AddComponent(typeof(FlowObject));
        // objPrefab.GetComponent<FlowObject>().Start();

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
        objData.position = new Vector3(0, 0, 0);
        objData.rotation = new Vector3(0, 0, 0);
        objData.scale = new Vector3(0, 0, 0);

        //create json and send to server
        jsonObject obj = new jsonObject();
        Mesh mesh = objPrefab.GetComponent<MeshFilter>().mesh;
        obj.vertices = mesh.vertices;
        obj.uv = mesh.uv;
        obj.triangles = mesh.triangles;
        obj.type = objPrefab.GetComponent<Collider>().GetType().Name;
        obj.position = objPrefab.transform.localPosition;
        obj.scale = objPrefab.transform.localScale;
        obj.rotation = new Vector4(objPrefab.transform.rotation.x, objPrefab.transform.rotation.y, 
                                    objPrefab.transform.rotation.z, objPrefab.transform.rotation.w);
        obj.objectName = objPrefab.name;
        //obj.id = objPrefab.GetComponent<FlowObject>().ft.id;
        obj.id = "";
        string json = JsonUtility.ToJson(obj);
        Debug.Log(json);

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
        // oo.transform.localPosition = new Vector3(ret.position.x + 3, ret.position.y, ret.position.z);
        // oo.transform.localScale = ret.scale;
        // oo.transform.localRotation = Quaternion.Euler(ret.rotation);
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
