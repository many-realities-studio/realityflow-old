using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEditor;
using RealityFlow.Plugin.Scripts;
//using RealityFlow.Plugin.Scripts.Events;
using System.IO;

namespace RealityFlow.Plugin.Editor
{
    public class RealityFlowWindow : EditorWindow
    {
        enum EWindowView
        {
            LOGIN = 0,
            USER_HUB = 1,
            PROJECT_HUB = 2,
            DELETE_OBJECT = 3,
            LOAD_PROJECT = 4,
            PROJECT_CREATION = 5,
            INVITE_USER = 6,
            PROJECT_IMPORT = 7
        }

        Vector2 scrollPos = Vector2.zero;
        Texture2D headerSectionTexture;
        public static bool testBool = false;
        Texture2D bodySectionTexture;

        Color headerSectionColor = new Color(13f / 255f, 32f / 255f, 44f / 255f, 1f);
        Color bodySectionColor = new Color(150 / 255f, 150 / 255f, 150 / 255f, 1f);

        Rect headerSection;
        Rect bodySection;

        bool loggedIn = false;

        GUISkin skin;

        EWindowView window = EWindowView.LOGIN;
        string uName = "", pWord = "";
        string user = "Mago", pass = "12345";

        string userToInvite = "";
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

        /// <summary>
        /// This function is called when this object becomes enabled and active
        /// </summary>
        private void OnEnable()
        {
            InitTextures();
            InitData();
            skin = Resources.Load<GUISkin>("guiStyles/RFSkin");
            CreateTag("ObjManager");
            CreateTag("imported");
        }

        //TODO: What does this do?
        private static void InitData()
        {
            objectData = (ObjectData)ScriptableObject.CreateInstance(typeof(ObjectData));
        }

        /// <summary>
        /// OnGUI is called for rendering and handling GUI events.
        /// This means that your OnGUI implementation might be called several times per frame (one call per event).
        /// For more information on GUI events see the Event reference. If the MonoBehaviour's enabled property is set to false, OnGUI() will not be called.
        /// </summary>
        private void OnGUI()
        {
            _DrawLayouts();
            _DrawHeader();
            DrawBody();
        }

        /// <summary>
        /// Update only gets called when in play mode.
        /// This function is called multiple times per second on all visible windows.
        /// </summary>
        void Update()
        {
            // If we have a user logged in
            if ((!Config.userId.Equals("-9999") && !Config.userId.Equals("")) && loggedIn == false)
            {
                // Send the user to the User Hub screen
                window = EWindowView.USER_HUB;

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
        private void _DrawLayouts()
        {
            headerSection.x = 0;
            headerSection.y = 0;
            headerSection.width = Screen.width;
            // Debug.Log(Screen.width);
            headerSection.height = 50;

            bodySection.x = 0;
            bodySection.y = 50;
            bodySection.width = Screen.width;
            bodySection.height = Screen.height - 50;

            GUI.DrawTexture(headerSection, headerSectionTexture);
            GUI.DrawTexture(bodySection, bodySectionTexture);

        }

        private void _DrawHeader()
        {
            GUILayout.BeginArea(headerSection);

            GUILayout.Label("Reality Flow", skin.GetStyle("Title"));

            GUILayout.EndArea();
        }

        private void _CreateLoginView()
        {
            // Create UserName entry field
            EditorGUILayout.BeginHorizontal();
            GUILayout.Label("User: ");
            uName = EditorGUILayout.TextField(uName);
            EditorGUILayout.EndHorizontal();

            // Create Password entry field
            EditorGUILayout.BeginHorizontal();
            GUILayout.Label("Password: ");
            pWord = EditorGUILayout.PasswordField(pWord);
            EditorGUILayout.EndHorizontal();

            // Create "Log in" Button and define onClick action
            if (GUILayout.Button("Log in", GUILayout.Height(40)))
            {
                GameObject manager = GameObject.FindGameObjectWithTag("ObjManager");

                // Create the ObjManager if one does not already exist
                if (manager == null)
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

                // Send login event to the server
                //UserLoginEvent login = new UserLoginEvent(uName, pWord);
                //login.Send(uName, pWord, FlowClient.CLIENT_EDITOR);
            }

            // Create "Register" Button and define onClick action

            if (GUILayout.Button("Register", GUILayout.Height(30)))
            {
                GameObject manager = GameObject.FindGameObjectWithTag("ObjManager");

                // Create the ObjManager if one does not exist
                if (manager == null)
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

                // Send register event to the server with the entered user name and password
                //UserRegisterEvent register = new UserRegisterEvent();
                //register.Send(uName, pWord, FlowClient.CLIENT_EDITOR);
            }

            // Create "Import" Button and define onClick action
            if (GUILayout.Button("Import", GUILayout.Height(20)))
            {
                // Send the user to the project import window
                window = EWindowView.PROJECT_IMPORT;
                DrawBody();
            }
        }

        private void _CreateUserHubView()
        {
            // Create "Logout" Button and define onClick action
            if (GUILayout.Button("Logout", GUILayout.Height(20)))
            {
                //// Send logout event to the server
                //UserLogoutEvent logout = new UserLogoutEvent();
                //logout.Send();

                // Set logged (global) state to false
                loggedIn = false;

                // Clear the user ID
                Config.userId = "-9999";

                // Send the user back to the login screen
                window = EWindowView.LOGIN;
                DrawBody();
            }

            // Create "New Project" Button and define onClick action
            if (GUILayout.Button("New Project", GUILayout.Height(40)))
            {
                // Send the user to the project creation screen
                window = EWindowView.PROJECT_CREATION;
                DrawBody();
            }

            // Create "Load Project" Button and define onClick action
            if (GUILayout.Button("Load Project", GUILayout.Height(40)))
            {
                // Send the user to the load project screen
                window = EWindowView.LOAD_PROJECT;
                DrawBody();
            }
        }

        private void _CreateProjectHubView()
        {
            // Create "Exit Project" Button and define onClick action
            if (GUILayout.Button("Exit Project", GUILayout.Height(20)))
            {
                ExitProject(); // Deletes all local instances of the objects and restores the projectID to default value

                // Send the user to the User Hub screen
                window = EWindowView.USER_HUB;
                DrawBody();
            }

            // Create "Create new object" Button and define onClick action
            if (GUILayout.Button("Create new Object", GUILayout.Height(40)))
            {
                // Opens a new window/unity utility tab to create an object
                ObjectSettings.OpenWindow();
            }

            // Create "Delete an object" Button and define onClick action
            if (GUILayout.Button("Delete an Object", GUILayout.Height(40)))
            {
                // Send user to Delete Object screen
                window = EWindowView.DELETE_OBJECT;
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

            // Create "Export" Button and define onClick action
            if (GUILayout.Button("Export", GUILayout.Height(20)))
            {
                // TODO: what does this do ?
                ConfirmationWindow.OpenWindow();
            }
        }

        private void _CreateDeleteObjectView()
        {
            GameObject objectManagerGameObject = GameObject.FindGameObjectWithTag("ObjManager");

            // Create "Back" Button and define onClick action
            EditorGUILayout.BeginHorizontal();
            if (GUILayout.Button("Back", GUILayout.Height(20)))
            {
                // Send the user to the Project Hub screen
                window = EWindowView.PROJECT_HUB;
                DrawBody();
            }
            EditorGUILayout.EndHorizontal();


            if (objectManagerGameObject != null)
            {
                List<GameObject> gameObjectsList = objectManagerGameObject.GetComponent<ObjectManager>().GetFlowObjects();

                // List out all game objects in the scene
                foreach (GameObject gameObject in gameObjectsList)
                {
                    // Add a button whose name is the name of the game object and define the onClick event
                    if (GUILayout.Button(gameObject.name, GUILayout.Height(30)))
                    {
                        DeleteObject(gameObject);
                    }
                }
            }
        }

        private void _CreateLoadProjectView()
        {
            // Create "Back" Button and define onClick action
            EditorGUILayout.BeginHorizontal();
            if (GUILayout.Button("Back", GUILayout.Height(20)))
            {
                // Send the user to the User Hub screen
                window = EWindowView.USER_HUB;
                DrawBody();
            }
            EditorGUILayout.EndHorizontal();

            // List all of the available projects
            if (Config.projectList != null)
            {
                foreach (FlowProject project in Config.projectList)
                {
                    // Add a button whose name is the name of the project and define the onClick event
                    if (GUILayout.Button(project.ProjectName, GUILayout.Height(30)))
                    {
                        //// Set the current project to the selected project
                        //Config.projectId = project._id;
                        //FlowProject.activeProject.projectName = project.projectName;

                        //// Send a request to the server to fetch the desired project
                        //ProjectFetchEvent fetch = new ProjectFetchEvent();
                        //fetch.Send(); /// TODO: Refactor to be more explicit about which project is getting fetched

                        // Send the user to the Project Hub screen
                        window = EWindowView.PROJECT_HUB;
                    }
                }
            }
        }

        private void _CreateProjectCreationView()
        {
            // Create "Back" Button and define onClick action
            EditorGUILayout.BeginHorizontal();
            if (GUILayout.Button("Back", GUILayout.Height(20)))
            {
                // Send the user back to the User Hub
                window = EWindowView.USER_HUB;
                DrawBody();
            }
            EditorGUILayout.EndHorizontal();

            // Add "Project Name" label
            EditorGUILayout.BeginHorizontal();
            GUILayout.Label("Project Name: ");
            projectName = EditorGUILayout.TextField(projectName);
            EditorGUILayout.EndHorizontal();

            // Make the user enter a project name if they did not enter one
            if (projectName == null || projectName.Equals(""))
            {
                EditorGUILayout.HelpBox("Enter a name for the project", MessageType.Warning);
            }
            else
            {
                // Create "Create Project" Button and define onClick action
                if (GUILayout.Button("Create Project", GUILayout.Height(40)))
                {
                    //// Send ProjectCreate event to the server
                    //ProjectCreateEvent create = new ProjectCreateEvent();
                    //create.Send(projectName);

                    // Send the user to the Project Hub screen
                    window = EWindowView.PROJECT_HUB;
                    projectName = ""; // TODO: What does this do?
                    DrawBody();
                }
            }
        }

        private void _CreateInviteUserView()
        {
            // Create "Back" Button and define onClick action
            EditorGUILayout.BeginHorizontal();
            if (GUILayout.Button("Back", GUILayout.Height(20)))
            {
                // Send user to the Project Hub Screen
                window = EWindowView.PROJECT_HUB;
                DrawBody();
            }
            EditorGUILayout.EndHorizontal();

            // Add Username label to the current screen
            EditorGUILayout.BeginHorizontal();
            GUILayout.Label("Username: ");
            userToInvite = EditorGUILayout.TextField(userToInvite);
            EditorGUILayout.EndHorizontal();

            // Ensure that there exists a user to invite
            if (userToInvite == null || userToInvite.Equals(""))
            {
                EditorGUILayout.HelpBox("Enter the username of the person to invite", MessageType.Warning);
            }
            else
            {
                // Create "Invite" Button and define onClick action
                if (GUILayout.Button("Invite", GUILayout.Height(40)))
                {
                    // Send Project Invite event to the server
                    //ProjectInviteEvent invite = new ProjectInviteEvent();
                    //invite.send(userToInvite);

                    // Send the user to the Project Hub screen
                    window = EWindowView.PROJECT_HUB;
                    DrawBody();
                }
            }
        }

        private void _CreateProjectImportView()
        {
            // Create "Back" Button and define onClick action
            EditorGUILayout.BeginHorizontal();
            if (GUILayout.Button("Back", GUILayout.Height(20)))
            {
                // Send user to the Login screen
                window = EWindowView.LOGIN;
                DrawBody();
            }
            EditorGUILayout.EndHorizontal();

            // TODO: Change the following from reading a text file to reading what is sent 
            //          from the server

            // Specify the path of where the project is saved
            string path = "Packages/com.RealityFlow/Resources/projects/test.txt";

            StreamReader reader = new StreamReader(path);
            List<string> jsonList = new List<string>();

            // Read each line of the file and add it to the json list
            while (reader.Peek() != -1)
            {
                jsonList.Add(reader.ReadLine());
            }
            reader.Close();

            // 
            foreach (string json in jsonList)
            {
                //TODO: What does this do?
                //ProjectFetchEvent log = new ProjectFetchEvent();
                //JsonUtility.FromJsonOverwrite(json, log);
                //string date = new System.DateTime(log.timestamp).ToString();

                // Create Project Button Button and define onClick action
                //if (GUILayout.Button(log.project.projectName + "   " + date, GUILayout.Height(30)))
                //{
                //    // gather the list of objects in the previous imported project
                //    GameObject[] gameObjectList = GameObject.FindGameObjectsWithTag("imported");

                //    // clear any previous imported objects
                //    foreach (GameObject gameObject in gameObjectList)
                //    {
                //        DestroyImmediate(gameObject);
                //    }

                //    // TODO: refactor name of log.objs to be more clear as to what that field is
                //    foreach (FlowTObject currentFlowTObject in log.objs)
                //    {
                //        // this piece of code doesn't have textures implemented
                //        // for an example on how to add the textures look at the commented
                //        // code in the SaveObjectData function

                //        Debug.Log("creating object: " + currentFlowTObject.name);
                //        GameObject newObj = GameObject.CreatePrimitive(PrimitiveType.Cube);

                //        // Create the mesh of the object
                //        Mesh objMesh = newObj.GetComponent<MeshFilter>().mesh;
                //        objMesh.vertices = currentFlowTObject.vertices;
                //        objMesh.uv = currentFlowTObject.uv;
                //        objMesh.triangles = currentFlowTObject.triangles;
                //        objMesh.RecalculateBounds();
                //        objMesh.RecalculateNormals();

                //        // Set the position and orientation of the object
                //        newObj.transform.localPosition = new Vector3(currentFlowTObject.x, currentFlowTObject.y, currentFlowTObject.z);
                //        newObj.transform.localRotation = Quaternion.Euler(new Vector4(currentFlowTObject.q_x, currentFlowTObject.q_y, currentFlowTObject.q_z, currentFlowTObject.q_w));
                //        newObj.transform.localScale = new Vector3(currentFlowTObject.s_x, currentFlowTObject.s_y, currentFlowTObject.s_z);

                //        // Destory the collider associated with the object (this is from the cube primitive
                //        MonoBehaviour.DestroyImmediate(newObj.GetComponent<Collider>(), true);

                //        newObj.AddComponent<BoxCollider>(); // Why do we destroy the collider just to add it back in?

                //        newObj.name = currentFlowTObject.name;
                //        newObj.tag = "imported";

                //        // Set the color of the object
                //        Material mat = newObj.GetComponent<MeshRenderer>().material;
                //        mat.color = currentFlowTObject.color;
                //    }

                //    // Send the user to the login screen
                //    window = EWindowView.LOGIN;
                //    DrawBody();
                //}
            }
        }

        private void DrawBody()
        {
            GUILayout.BeginArea(bodySection);
            scrollPos = EditorGUILayout.BeginScrollView(scrollPos, GUILayout.Width(Screen.width), GUILayout.Height(Screen.height - 70));

            // TODO: change window value to an enum
            switch (window)
            {
                // login window
                case EWindowView.LOGIN:
                    _CreateLoginView();
                    break;

                case EWindowView.USER_HUB:
                    _CreateUserHubView();
                    break;

                case EWindowView.PROJECT_HUB:
                    _CreateProjectHubView();
                    break;

                case EWindowView.DELETE_OBJECT:
                    _CreateDeleteObjectView();
                    break;

                case EWindowView.LOAD_PROJECT:
                    _CreateLoadProjectView();
                    break;

                case EWindowView.PROJECT_CREATION:
                    _CreateProjectCreationView();
                    break;

                case EWindowView.INVITE_USER:
                    _CreateInviteUserView();
                    break;

                case EWindowView.PROJECT_IMPORT:
                    _CreateProjectImportView();
                    break;
            }
            EditorGUILayout.EndScrollView();
            GUILayout.EndArea();
        }

        /// <summary>
        /// Sends a Delete event to the server to delete the desired game object
        /// </summary>
        /// <param name="gameObjectToBeDeleted"></param>
        public void DeleteObject(GameObject gameObjectToBeDeleted)
        {
            //ObjectDeleteEvent delete = new ObjectDeleteEvent();
            //delete.Send(gameObjectToBeDeleted.GetComponent<FlowObject>().ft._id);
        }

        public void ExitProject()
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
                //FlowProject.activeProject.transformsById = new Dictionary<string, FlowTObject>();
                //FlowProject.activeProject.transforms = new List<FlowTObject>();
            }
        }

        public void CreateTag(string s)
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
}