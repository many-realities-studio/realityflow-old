using Microsoft.MixedReality.Toolkit.Input;
using Microsoft.MixedReality.Toolkit.UI;
using Packages.realityflow_package.Runtime.scripts;
using RealityFlow.Plugin.Scripts;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using UnityEngine;

public class NetworkManagerHL : MonoBehaviour
{
    //private const string Url = "ws://localhost:8999/";
    private const string Url = "ws://plato.mrl.ai:8999";
    private List<FlowProject> _ProjectList;
    public List<string> availableProjects;
    private Dictionary<string, string> projectNames;

    public GameObject checkedOut;
    public GameObject projectMenu;
    public GameObject objectMenu;

    private bool play = false;

    public void UpdateCheckedOut(GameObject newObject)
    {
        checkedOut = newObject;
    }

    public bool CheckedOutIsNull()
    {
        return checkedOut == null;
    }

    public void TogglePlayMode()
    {
        play = !play;
    }

    public void Update()
    {
        if (FlowWebsocket.websocket != null && !play)
        {
            Unity.EditorCoroutines.Editor.EditorCoroutineUtility.StartCoroutine(Operations._FlowWebsocket.ReceiveMessage(), Operations._FlowWebsocket);
        }
    }

    public void PopulateProjects()
    {
        Operations.Login(ConfigurationSingleton.CurrentUser, Url, (_, e) =>
        {
            Debug.Log("login callback: " + e.message.WasSuccessful.ToString());
            if (e.message.WasSuccessful == true)
            {
                Operations.GetAllUserProjects(ConfigurationSingleton.CurrentUser, (__, _e) =>
                {
                    _ProjectList = _e.message.Projects;

                    foreach(FlowProject p in _ProjectList)
                    {
                        availableProjects.Add(p.ProjectName);
                        projectNames.Add(p.ProjectName, p.Id);
                    }
                });
            }
            else
            {
                ConfigurationSingleton.CurrentUser = null;
                // TODO: Display that login failed
            }
        });
    }

    public void OpenProject(string project)
    {
        projectNames.TryGetValue(project, out var id);

        Operations.OpenProject(id, ConfigurationSingleton.CurrentUser, (_, e) =>
        {
            Debug.Log(e.message);
            if (e.message.WasSuccessful == true)
            {
                ConfigurationSingleton.CurrentProject = e.message.flowProject;
                projectMenu.SetActive(true);


                foreach (FlowTObject currentFlowObject in FlowTObject.idToGameObjectMapping.Values)
                {
                    GameObject temp = currentFlowObject.AttachedGameObject;
                    InitializeGameObject(temp);
                }
            }
        });
    }

    private void InitializeGameObject(GameObject temp)
    {
        var mani = temp.AddComponent<ManipulationHandler>();
        var bb = temp.AddComponent<BoundingBox>();
        temp.AddComponent<NearInteractionGrabbable>();

        mani.HostTransform = temp.transform;
        mani.ManipulationType = ManipulationHandler.HandMovementType.OneAndTwoHanded;
        mani.TwoHandedManipulationType = ManipulationHandler.TwoHandedManipulation.MoveRotateScale;
        mani.AllowFarManipulation = true;

        bb.Target = temp;
        if (temp.GetComponent<BoxCollider>())
            bb.BoundsOverride = temp.GetComponent<BoxCollider>();

        mani.OnManipulationStarted.AddListener(DetermineCheckedOut);
    }

    private void DetermineCheckedOut(ManipulationEventData eventData)
    {
        if (checkedOut == null)
        {
            objectMenu.GetComponent<SubmitObjectUpdates>().AttachToObject(eventData.ManipulationSource);
        }
        else
        {
            objectMenu.GetComponent<SubmitObjectUpdates>().SetSecondObject(eventData.ManipulationSource);
        }
    }

    public void CreateProject(string projectName)
    {
        ConfigurationSingleton.CurrentProject = new FlowProject("GUID", "description", 0, projectName/*, new List<FlowTObject>()*/);

        Operations.CreateProject(ConfigurationSingleton.CurrentProject, ConfigurationSingleton.CurrentUser, (_, e) =>
        {
            if (e.message.WasSuccessful)
            {
                Debug.Log(e.message);
                projectMenu.SetActive(true);
            }
            else
            {
                ConfigurationSingleton.CurrentProject = null;
                // TODO: display to the user that create project failed
            }
        });
    }


    public void Logout()
    {
        Operations.Logout(ConfigurationSingleton.CurrentUser);
    }

    public void DeleteObject(string name)
    {
        foreach (FlowTObject currentFlowObject in FlowTObject.idToGameObjectMapping.Values)
        {
            if (currentFlowObject.Name == name)
            {
                //TODO: make sure this deletes the object
                Operations.DeleteObject(currentFlowObject.Id, ConfigurationSingleton.CurrentProject.Id, (_, e) => { Debug.Log("Deleted Object " + e.message); });
            }
        }
    }


    public void CreateObject(FlowTObject flowObject)
    {
        Operations.CreateObject(flowObject, ConfigurationSingleton.CurrentProject.Id, (_, e) => { Debug.Log("Created Object " + e.message); });
        FlowTObject.idToGameObjectMapping.Add(flowObject.Name, flowObject);
        InitializeGameObject(flowObject.AttachedGameObject);
    }

    public void ExitProject()
    {
        FlowTObject.RemoveAllObjectsFromScene();
        ConfigurationSingleton.CurrentProject = null;
    }


}
