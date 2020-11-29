using System;
using System.Collections.Generic;
using UnityEngine;
using TMPro;
using RealityFlow.Plugin.Scripts;
using Packages.realityflow_package.Runtime.scripts;
using Behaviours;
using Packages.realityflow_package.Runtime.scripts.Structures.Actions;

public class InteractionManager : MonoBehaviour
{

    public TMP_Dropdown teleportDropdown1;
    public TMP_Dropdown teleportDropdown2;
    public TMP_Dropdown onClickDropdown;
    public TMP_Dropdown snapZoneDropdown;
    public TMP_Dropdown enableDropdown;
    public TMP_Dropdown disableDropdown;

    Dictionary<string, string> objectList;

    // Start is called before the first frame update
    void Start()
    {
      objectList = new Dictionary<string, string>();    
    }

    public void InteractionSelection(int button)
    {
        switch(button)
        {
            case 0:
                PopulateDropDownMenu(teleportDropdown1, teleportDropdown2);
                break;
            case 1:
                PopulateDropDownMenu(onClickDropdown);
                break;
            case 2:
                PopulateDropDownMenu(snapZoneDropdown);
                break;
            case 3:
                PopulateDropDownMenu(disableDropdown);
                break;
            case 4:
                PopulateDropDownMenu(enableDropdown);
                break;
            case '_':
                break;
        }
    }

    /// <summary>
    /// Populates the dropdown with all the object names
    /// </summary>
    /// <param name="dropdown"></param>
    private void PopulateDropDownMenu(TMP_Dropdown dropdown)
    {
        dropdown.options.Clear();

        objectList.Clear();

        foreach (FlowTObject k in FlowTObject.idToGameObjectMapping.Values)
        {
            objectList.Add(k.Name, k.Id);
        }

        foreach(string k in objectList.Keys)
        {
            dropdown.options.Add(new TMP_Dropdown.OptionData(k));
        }
    }

    /// <summary>
    /// Populates two dropdown menus with all the object names
    /// </summary>
    /// <param name="dropdown1"></param>
    /// <param name="dropdown2"></param>
    private void PopulateDropDownMenu(TMP_Dropdown dropdown1, TMP_Dropdown dropdown2)
    {
        dropdown1.options.Clear();
        dropdown2.options.Clear();

        objectList.Clear();

        foreach (FlowTObject k in FlowTObject.idToGameObjectMapping.Values)
        {
            objectList.Add(k.Name, k.Id);
        }

        foreach (string k in objectList.Keys)
        {
            TMP_Dropdown.OptionData item = new TMP_Dropdown.OptionData(k);
            dropdown1.options.Add(item);
            dropdown2.options.Add(item);
        }
    }

    /// <summary>
    /// Creates a teleport behaviour using the coordinates of object2
    /// </summary>
    public void CreateTeleport()
    {
        int index1 = teleportDropdown1.value;
        int index2 = teleportDropdown2.value;

        string object1name = teleportDropdown1.options[index1].text;
        string object2name = teleportDropdown1.options[index2].text;

        objectList.TryGetValue(object1name, out string firstObjectId);
        objectList.TryGetValue(object2name, out string secondObjectId);

        // Find second game object so we can create the teleport coordinates based off it
        GameObject go = FlowTObject.idToGameObjectMapping[secondObjectId].AttachedGameObject;

        TeleportCoordinates teleportCoordinates = new TeleportCoordinates(go.transform.position, go.transform.rotation, go.transform.localScale, false);
        TeleportAction teleportAction = new TeleportAction(teleportCoordinates);

        FlowBehaviour fb = new FlowBehaviour("Immediate", Guid.NewGuid().ToString(), firstObjectId, firstObjectId, teleportAction);
        AddBehaviour(fb);
    }


    /// <summary>
    /// Creates a SnapZone behaviour using the coordinates of object2
    /// </summary>
    public void CreateSnapZone()
    {
        
    }


    /// <summary>
    /// Creates an on Click behaviour. A chain must always be created
    /// after an click behaviour is created
    /// </summary>
    public void CreateClick()
    {
        int index1 = onClickDropdown.value;
        string object1name = onClickDropdown.options[index1].text;

        objectList.TryGetValue(object1name, out string firstObjectId);

        FlowBehaviour fb = new FlowBehaviour("Click", Guid.NewGuid().ToString(), firstObjectId, firstObjectId, null);
        AddBehaviour(fb);
    }

    /// <summary>
    /// Creates an on Enable behaviour
    /// </summary>
    public void CreateEnable()
    {
        int index1 = enableDropdown.value;
        string object1name = enableDropdown.options[index1].text;

        objectList.TryGetValue(object1name, out string firstObjectId);

        FlowAction flowAction = new FlowAction();
        flowAction.ActionType = "Enable";

        FlowBehaviour fb = new FlowBehaviour("Immediate", Guid.NewGuid().ToString(), firstObjectId, firstObjectId, flowAction);
        AddBehaviour(fb);
    }


    /// <summary>
    /// Creates an on Disable behaviour
    /// </summary>
    public void CreateDisable()
    {
        int index1 = disableDropdown.value;
        string object1name = disableDropdown.options[index1].text;

        objectList.TryGetValue(object1name, out string firstObjectId);

        FlowAction flowAction = new FlowAction();
        flowAction.ActionType = "Disable";

        FlowBehaviour fb = new FlowBehaviour("Immediate", Guid.NewGuid().ToString(), firstObjectId, firstObjectId, flowAction);
        AddBehaviour(fb);
    }



    /// <summary>
    /// If not adding on to the behaviour chain, then sends a CreateBehaviour request to server.
    /// If adding on to the behaviour chain, then adds the flowBehaviour to the end of the current chain
    /// </summary>
    /// <param name="flowbehaviour"></param>
    private void AddBehaviour(FlowBehaviour newFlowBehaviour)
    {

        // Create the list of behaviours that need to add newFlowBehaviour to their chain 
        List<string> behavioursToLinkTo = new List<string>();
        if (BehaviourEventManager.PreviousBehaviourId != null)
        {
            behavioursToLinkTo.Add(BehaviourEventManager.PreviousBehaviourId);
        }

        // Create the new behaviour
        Operations.CreateBehaviour(newFlowBehaviour, ConfigurationSingleton.SingleInstance.CurrentProject.Id, behavioursToLinkTo, (sender, e) =>
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
}


