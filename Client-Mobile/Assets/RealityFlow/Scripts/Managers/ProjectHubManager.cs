using Packages.realityflow_package.Runtime.scripts;
using RealityFlow.Plugin.Scripts;
using System.Collections.Generic;
using TMPro;
using UnityEngine;
using UnityEngine.SceneManagement;
using Config = MobileConfiguration.Config;

public class ProjectHubManager : MonoBehaviour
{
    public Dictionary<int, string> prefabOptions = new Dictionary<int, string>();
    public TMP_Dropdown prefabOptionsDropdown;
    public TMP_InputField objectNameField;
    public TMP_Text projectNameText;
    public TMP_Text projectInviteCode;

    public Transform cameraObject;

    private const int BUILD_SETTING_LOGIN_REGISTER = 0;

    public GameObject objectCreatedSuccess;
    // public GameObject[] prefabOptions = new GameObject[numberOfPrefabOptions];

    // Start is called before the first frame update
    void Start()
    {
        prefabOptionsDropdown.options.Clear();
        prefabOptionsDropdown.options.Add(new TMP_Dropdown.OptionData("Cube"));
        prefabOptionsDropdown.options.Add(new TMP_Dropdown.OptionData("Sphere"));
        prefabOptionsDropdown.options.Add(new TMP_Dropdown.OptionData("Capsule"));
        prefabOptionsDropdown.options.Add(new TMP_Dropdown.OptionData("ChickenBrown"));
        prefabOptionsDropdown.options.Add(new TMP_Dropdown.OptionData("Cow"));
        prefabOptionsDropdown.options.Add(new TMP_Dropdown.OptionData("DuckWhite"));
        prefabOptionsDropdown.options.Add(new TMP_Dropdown.OptionData("Pig"));
        prefabOptionsDropdown.options.Add(new TMP_Dropdown.OptionData("SheepWhite"));

        if (Config.ProjectToLoadId != null)
        {
            Operations.OpenProject(Config.ProjectToLoadId, ConfigurationSingleton.SingleInstance.CurrentUser, (_, e) =>
            {
                if (e.message.WasSuccessful == true)
                {
                    Debug.Log("project opening is successful");
                    ConfigurationSingleton.SingleInstance.CurrentProject = e.message.flowProject;

                    projectNameText.text = e.message.flowProject.ProjectName;
                    projectInviteCode.text = e.message.flowProject.Id;

                }
            });
        }
        else
        {
            Debug.Log("No projects");
        }
    }

    // Update is called once per frame
    void Update()
    {
        if(FlowWebsocket.websocket != null)
        {
              Unity.EditorCoroutines.Editor.EditorCoroutineUtility.StartCoroutine(Operations._FlowWebsocket.ReceiveMessage(), Operations._FlowWebsocket);
        }
    }



    /// <summary>
    /// Sends a request to server to create a new object.
    /// </summary>
    public void CreateObject()
    {
        // Grab the type of prefab selected
        int index = prefabOptionsDropdown.value;
        string prefab = prefabOptionsDropdown.options[index].text;

        // Grab the name of the new object
        string objectName = objectNameField.text;

        // Object always appears 5 feet in front of the camera.
        Vector3 position = new Vector3(cameraObject.position.x, cameraObject.position.y, cameraObject.position.z + 5);
        Quaternion rotation = new Quaternion(0f, 0f, 0f, 1f);
        Vector3 scale = new Vector3(1f, 1f, 1f);
        Color color = new Color(0,0,0);

        FlowTObject newObject = new FlowTObject(objectName, position, rotation, scale, color, prefab);
        Operations.CreateObject(newObject, ConfigurationSingleton.SingleInstance.CurrentProject.Id, (_, e) =>
        {
            // add in error check
            // if(e.message.WasSuccessful
            objectCreatedSuccess.SetActive(true);

            // Debug.Log("Object has been created!");
        });
    }



    /// <summary>
    /// Sends a request to server to leave the current project. Redirects to user hub page if successful.
    /// </summary>
    public void LeaveProject()
    {
        Operations.LeaveProject(ConfigurationSingleton.SingleInstance.CurrentProject.Id, ConfigurationSingleton.SingleInstance.CurrentUser, (_, e) =>
        {
            if(e.message.WasSuccessful == true)
            {
                MainMenuManager.activePanel = MainMenuManager.USERHUB_PANEL;
                Config.LeftProject = true;

                // Load the build Login/Register scene but open it at the UserHub view
                SceneManager.LoadScene(BUILD_SETTING_LOGIN_REGISTER);
                FlowTObject.idToGameObjectMapping.Clear();
            }
        });
    }
}
