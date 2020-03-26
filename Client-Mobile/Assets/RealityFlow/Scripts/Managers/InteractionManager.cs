using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using TMPro;
using RealityFlow.Plugin.Scripts;
using Packages.realityflow_package.Runtime.scripts;

public class InteractionManager : MonoBehaviour
{

    public TMP_Dropdown teleportDropdown1;
    public TMP_Dropdown teleportDropdown2;
    public TMP_Dropdown onClickDropdown;
    public TMP_Dropdown snapZoneDropdown;
    public TMP_Dropdown enableDropdown;
    public TMP_Dropdown disableDropdown;

    private FlowBehaviour headBehaviour = null;
    private FlowBehaviour currentBehaviour = null;

    private Boolean addingChain = false;


    private FlowUser flowUser = new FlowUser("moira", "rose");
    private string projectId = "dtr54e4";
    Dictionary<string, string> objectList;

    private string currentInteraction = null;
    // Start is called before the first frame update
    void Start()
    {
        CreateFakeObjects();    
    }

    private void CreateFakeObjects()
    {
        objectList = new Dictionary<string, string>();

        objectList.Add("The square", "123445");
        objectList.Add("Object 34", "jwe2335");
        objectList.Add("Sphere", "34h3o5o");
        objectList.Add("enemy 1", "kj23iij35");
    }

    private void OnEnable()
    {
        Debug.Log("it's enabling");
        //headBehaviour = null;
        //currentBehaviour = null;
        //addingChain = false;
    }

    public void InteractionSelection(int button)
    {
        switch(button)
        {
            case 0:
                currentInteraction = "Teleport";
                PopulateDropDownMenu(teleportDropdown1, teleportDropdown2);
                break;
            case 1:
                currentInteraction = "Click";
                PopulateDropDownMenu(onClickDropdown);
                break;
            case 2:
                currentInteraction = "Snap Zone";
                PopulateDropDownMenu(snapZoneDropdown);
                break;
            case 3:
                currentInteraction = "Disable";
                PopulateDropDownMenu(disableDropdown);
                break;
            case 4:
                currentInteraction = "Enable";
                PopulateDropDownMenu(enableDropdown);
                break;
            case '_':
                break;
        }
    }

    private void PopulateDropDownMenu(TMP_Dropdown dropdown)
    {
        dropdown.options.Clear();
        foreach(string k in objectList.Keys)
        {
            dropdown.options.Add(new TMP_Dropdown.OptionData(k));
        }
    }

    private void PopulateDropDownMenu(TMP_Dropdown dropdown1, TMP_Dropdown dropdown2)
    {
        dropdown1.options.Clear();
        dropdown2.options.Clear();

        foreach (string k in objectList.Keys)
        {
            TMP_Dropdown.OptionData item = new TMP_Dropdown.OptionData(k);
            dropdown1.options.Add(item);
            dropdown2.options.Add(item);
        }
    }

    public void SendTeleport(int addingChain)
    {
        int index1 = teleportDropdown1.value;
        int index2 = teleportDropdown2.value;

        string object1name = teleportDropdown1.options[index1].text;
        string object2name = teleportDropdown1.options[index2].text;

        objectList.TryGetValue(object1name, out string firstObjectId);
        objectList.TryGetValue(object2name, out string secondObjectId);

        FlowBehaviour fb = new FlowBehaviour(currentInteraction, "1", firstObjectId, secondObjectId, null);

        AddBehaviour(fb, addingChain == 0 ? false : true);
    }

    public void AddBehaviour(FlowBehaviour fb, Boolean addingChain)
    {
        if (headBehaviour == null)
        {
            headBehaviour = fb;
            Debug.Log("Making " + fb.Name + " the head behaviour");
        }
        else
        {
            FlowBehaviour head;
            for (head = headBehaviour; head.BehaviourChain != null; head = head.BehaviourChain) { }

            head.BehaviourChain = fb;
            Debug.Log("making " + fb.Name + " the chain behaviour");
        }

        if (!addingChain)
        {
            Operations.CreateBehaviour(headBehaviour, flowUser, projectId, "something", (_, e) =>
            {
                if (e.message.WasSuccessful == true)
                { }
            });
        }
    }

    public void CreateClick()
    {
        int index1 = onClickDropdown.value;
        string object1name = onClickDropdown.options[index1].text;

        objectList.TryGetValue(object1name, out string firstObjectId);

        FlowBehaviour fb = new FlowBehaviour("Click", "1", firstObjectId, firstObjectId, null);
        AddBehaviour(fb, true);
    }

    public void CreateEnable(int addingChain)
    {
        int index1 = enableDropdown.value;
        string object1name = enableDropdown.options[index1].text;

        objectList.TryGetValue(object1name, out string firstObjectId);

        FlowBehaviour fb = new FlowBehaviour("Enable", "1", firstObjectId, firstObjectId, null);
        AddBehaviour(fb, addingChain == 0 ? false : true);
    }

    public void CreateDisable(int addingChain)
    {
        int index1 = disableDropdown.value;
        string object1name = disableDropdown.options[index1].text;

        objectList.TryGetValue(object1name, out string firstObjectId);

        FlowBehaviour fb = new FlowBehaviour("Disable", "1", firstObjectId, firstObjectId, null);
        AddBehaviour(fb, addingChain == 0 ? false : true);
    }


    public void SetAddingChain(int response)
    {
        if (response == 0)
            this.addingChain = false;
        else
            this.addingChain = true;
    }


    // Update is called once per frame
    void Update()
    {
        
    }
}


