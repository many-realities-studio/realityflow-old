using Behaviours;
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
    public List<FlowProject> _ProjectList = new List<FlowProject>();
    public List<string> availableProjects = new List<string>();
    private Dictionary<string, string> projectNames = new Dictionary<string, string>();

    public GameObject checkedOut;
    public GameObject projectMenu;
    public GameObject objectMenu;

    public PopulateProjects populate;

    public bool play = false;

    public void UpdateCheckedOut(GameObject newObject)
    {
        if (play)
            return;
        if (newObject == null)
        {
            Operations.CheckinObject(checkedOut.GetComponent<ObjectIsInteractable>().GetGuid(), ConfigurationSingleton.CurrentProject.Id, (_, e) =>
            {
                if (e.message.WasSuccessful)
                {
                    FlowTObject checkedInObject = FlowTObject.idToGameObjectMapping[e.message.ObjectID];
                    Debug.Log("Checking in " + checkedInObject.Name);
                    checkedInObject.CanBeModified = false;
                }

                else
                {
                    FlowTObject.idToGameObjectMapping[e.message.ObjectID].CanBeModified = true;
                }
            });
        }
        else
        {
            if (!newObject.GetComponent<ObjectIsInteractable>())
                BehaviourEventManager.MakeObjectInteractable(newObject, newObject.GetComponent<FlowObject_Monobehaviour>().underlyingFlowObject.Id);
            Operations.CheckoutObject(newObject.GetComponent<ObjectIsInteractable>().GetGuid(), ConfigurationSingleton.CurrentProject.Id, (_, e) =>
            { 
                if (e.message.WasSuccessful)
                {
                    FlowTObject checkedOutObject = FlowTObject.idToGameObjectMapping[e.message.ObjectID];
                    Debug.Log("Checking out " + checkedOutObject.Name);
                    checkedOutObject.CanBeModified = true;
                }

                else
                {
                    FlowTObject.idToGameObjectMapping[e.message.ObjectID].CanBeModified = false;
                }
            });

        }

        checkedOut = newObject;
    }

    public bool CheckedOutIsNull()
    {
        return checkedOut == null;
    }

    public void TogglePlayMode()
    {
        play = !play;
        BehaviourEventManager.isPlaying = play;
    }

    public void Update()
    {
        if (FlowWebsocket.websocket != null)
        {
            Unity.EditorCoroutines.Editor.EditorCoroutineUtility.StartCoroutine(Operations._FlowWebsocket.ReceiveMessage(), Operations._FlowWebsocket);
        }
    }

    public void PopulateProjects()
    {
        _ProjectList.Clear();
        availableProjects.Clear();
        projectNames.Clear();
        Operations.Login(ConfigurationSingleton.CurrentUser, Url, (_, e) =>
        {
            Debug.Log("login callback: " + e.message.WasSuccessful.ToString());
            if (e.message.WasSuccessful == true)
            {
                Operations.GetAllUserProjects(ConfigurationSingleton.CurrentUser, (__, _e) =>
                {
                    _ProjectList = _e.message.Projects;

                    populate.Initialize();
                });
            }
            else
            {
                ConfigurationSingleton.CurrentUser = null;
                // TODO: Display that login failed
            }
        });
    }

    public void OpenProject(string project, string id)
    {
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

    public void InitializeGameObject(GameObject temp)
    {
        return;
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

        if (!temp.GetComponent<ObjectIsInteractable>() && !temp.GetComponent<ListenToPointer>())
            BehaviourEventManager.MakeObjectInteractable(temp, temp.GetComponent<FlowObject_Monobehaviour>().underlyingFlowObject.Id);
    }

    public void DetermineCheckedOut(ManipulationEventData eventData)
    {
        if (eventData.ManipulationSource.GetComponent<ListenToPointer>())
        {
            return;
        }
        if (!eventData.ManipulationSource.GetComponent<ObjectIsInteractable>())
            BehaviourEventManager.MakeObjectInteractable(eventData.ManipulationSource, eventData.ManipulationSource.GetComponent<FlowObject_Monobehaviour>().underlyingFlowObject.Id);
        if (play)
        {
            eventData.ManipulationSource.GetComponent<ObjectIsInteractable>().OnSelect();
            return;
        }
        if (checkedOut == null)
        {
            objectMenu.GetComponent<SubmitObjectUpdates>().AttachToObject(eventData.ManipulationSource);
        }
        objectMenu.GetComponent<SubmitObjectUpdates>().SetSecondObject(eventData.ManipulationSource);
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

    public void UpdateObject(GameObject go)
    {
        Operations.UpdateObject(go.GetComponent<FlowObject_Monobehaviour>().underlyingFlowObject, ConfigurationSingleton.CurrentUser, ConfigurationSingleton.CurrentProject.Id, (_, e) => { Debug.Log("Updating Object " + e.message); });
    }

    public void DeleteObject(string name)
    {
        foreach (FlowTObject currentFlowObject in FlowTObject.idToGameObjectMapping.Values)
        {
            if (currentFlowObject.Name == name)
            {
                Operations.DeleteObject(currentFlowObject.Id, ConfigurationSingleton.CurrentProject.Id, (_, e) => { Debug.Log("Deleted Object " + e.message); });
            }
        }
    }


    public void CreateObject(string name, Vector3 pos, Quaternion rotation, Vector3 scale, Color color, string prefab)
    {
        FlowTObject flowObject = new FlowTObject(name, pos, rotation, scale, color, prefab);
        Operations.CreateObject(flowObject, ConfigurationSingleton.CurrentProject.Id, (_, e) => { Debug.Log("Created Object " + e.message); });
        FlowTObject.idToGameObjectMapping.Add(flowObject.Name, flowObject);
        InitializeGameObject(flowObject.AttachedGameObject); 
        Operations.CheckinObject(flowObject.Id, ConfigurationSingleton.CurrentProject.Id, (_, e) => { Debug.Log("Checked Out Object " + e.message); });
    }

    public void CreateBehaviour(FlowBehaviour b ,FlowBehaviour z)
    {
        Debug.Log("About to add behaviour");
        // Create the list of behaviours that need to add newFlowBehaviour to their chain 
        List<string> behavioursToLinkTo = new List<string>();
        if (z != null)
            behavioursToLinkTo.Add(z.Id);
        /*
        if (BehaviourEventManager.PreviousBehaviourId != null)
        {
            behavioursToLinkTo.Add(BehaviourEventManager.PreviousBehaviourId);
        }*/

        // Create the new behaviour
        Operations.CreateBehaviour(b, ConfigurationSingleton.CurrentProject.Id, behavioursToLinkTo, (sender, e) =>
        {
            if (e.message.WasSuccessful == true)
            {
                // Update the Previous behaviour Id
                BehaviourEventManager.PreviousBehaviourId = e.message.flowBehaviour.Id;
            }

            else
            {
                Debug.LogWarning("Failed to create behaviour");
            }
        });
    }
    
    public void DeleteBehaviour(FlowBehaviour b)
    {
        // Make the List that will keep all the behaviour ids in the chain so we can send to server to delete
        List<string> deleteBehaviourIds = new List<string>();

        // Make a reference so we can traverse down the chain
        FlowBehaviour head = b;
        deleteBehaviourIds.Add(b.Id);

        // Add the behaviour's chain Id's
        while (head.NextBehaviour != null && head.NextBehaviour.Count > 0)
        {
            // this should be doing BFS and adding each id into the delete
            // but for now ui is setup to only have one behaviour in a behaviour's 
            // nextbehaviour array, so for now just add the first one
            deleteBehaviourIds.Add(head.NextBehaviour[0]);

            // make the nextbeheviour the new head and iterate through its chain
            head = BehaviourEventManager.BehaviourList[head.NextBehaviour[0]];
        }

        Operations.DeleteBehaviour(deleteBehaviourIds, ConfigurationSingleton.CurrentProject.Id, (_, e) =>
        {
            if (e.message.WasSuccessful)
            {
                Debug.Log("Successfully deleted behaviours ");
                foreach (string s in e.message.BehaviourIds)
                {
                    Debug.Log(s);
                }
            }
            else
            {
                Debug.Log("Unable to delete the behaviours");
            }

        });
    }

    public void UpdateBehaviour(FlowBehaviour b)
    {
        Operations.UpdateBehaviour(b, ConfigurationSingleton.CurrentProject.Id, (_, e) => { Debug.Log("Updated Behaviour " + e.message); });
    }

    public void ExitProject()
    {
        FlowTObject.RemoveAllObjectsFromScene();
        ConfigurationSingleton.CurrentProject = null;
    }


}
