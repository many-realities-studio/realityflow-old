using Behaviours;
using Packages.realityflow_package.Runtime.scripts.Structures.Actions;
using RealityFlow.Plugin.Scripts;
using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class SubmitObjectUpdates : MonoBehaviour
{
    public GameObject tiedTo;

    private string interaction;

    private FlowBehaviour e;
    private GameObject secondObject;
    public GameObject secondObjectPrompt;

    private FlowBehaviour edit;

    public SelectPreviousMenu SelectPrevious;

    public void UpdateCheckedOut()
    {
        FindObjectOfType<NetworkManagerHL>().UpdateCheckedOut(null);
    }

    public void EnableTiedTo()
    {
        tiedTo.SetActive(true);
    }

    public void DisableTiedTo()
    {
        tiedTo.SetActive(false);
    }

    public void SetEdit(FlowBehaviour ed)
    {
        edit = ed;
    }

    public void Update()
    {
        if (FindObjectOfType<NetworkManagerHL>().play)
            gameObject.SetActive(false);
    }

    public void AttachToObject(GameObject go)
    {
        NetworkManagerHL nm = FindObjectOfType<NetworkManagerHL>();
        if (nm.CheckedOutIsNull())
        {
            tiedTo = go;
            transform.position = go.transform.position;
            //transform.LookAt(Camera.main.transform);
            
            nm.UpdateCheckedOut(go);

            gameObject.SetActive(true);
        }
    }

    public void FixedUpdate()
    {
        transform.position = tiedTo.transform.position;
    }

    public void DeleteObject()
    {
        FindObjectOfType<NetworkManagerHL>().DeleteObject(tiedTo.name);
    }

    public void SetInteractionType(string i)
    {
        interaction = i;
    }

    public void SetSecondObject(GameObject go)
    {
        if (secondObjectPrompt.activeSelf)
        {
            secondObject = go;
        }
    }

    public void MakeInteraction(bool isChain)
    {
        Transform t = SelectPrevious.GetCoords();

        FlowBehaviour temp;
        string gu = Guid.NewGuid().ToString();
        if (edit != null)
        {
            interaction = edit.BehaviourName;
            gu = edit.Id;
        }

        switch (interaction)
        {
            case "Click":
                FlowAction flowAction = new FlowAction();
                temp = new FlowBehaviour(null, gu, tiedTo.GetComponent<ObjectIsInteractable>().GetGuid(), secondObject.GetComponent<ObjectIsInteractable>().GetGuid(), flowAction);
                break;
            case "Disable":
            case "Enable":
                FlowAction fAction = new FlowAction(interaction);
                temp = new FlowBehaviour("Immediate", gu, tiedTo.GetComponent<ObjectIsInteractable>().GetGuid(), secondObject.GetComponent<ObjectIsInteractable>().GetGuid(), fAction);
                break;
            case "Teleport":
                TeleportCoordinates tele = new TeleportCoordinates(t.position, t.rotation, t.localScale, false);
                TeleportAction tAction = new TeleportAction(tele);
                temp = new FlowBehaviour("Immediate", gu, tiedTo.GetComponent<ObjectIsInteractable>().GetGuid(), secondObject.GetComponent<ObjectIsInteractable>().GetGuid(), tAction);
                break;
            case "SnapZone":
                TeleportCoordinates snap = new TeleportCoordinates(t.position, t.rotation, t.localScale, true);
                TeleportAction teleAction = new TeleportAction(snap);
                temp = new FlowBehaviour("Immediate", gu, tiedTo.GetComponent<ObjectIsInteractable>().GetGuid(), secondObject.GetComponent<ObjectIsInteractable>().GetGuid(), teleAction);
                break;
            default:
                FlowAction action = new FlowAction();
                temp = new FlowBehaviour(interaction, gu, tiedTo.GetComponent<ObjectIsInteractable>().GetGuid(), secondObject.GetComponent<ObjectIsInteractable>().GetGuid(), action);
                break;
        }

        if (edit != null)
        {
            FindObjectOfType<NetworkManagerHL>().UpdateBehaviour(temp);
        }
        else
        {
            e = SelectPrevious.GetCurrentEvent();
            FindObjectOfType<NetworkManagerHL>().CreateBehaviour(temp, e);
            if (e != null)
            {
                e.NextBehaviour.Add(temp.Id);
                FindObjectOfType<NetworkManagerHL>().UpdateBehaviour(e);
            }
        }
        SelectPrevious.SetCurrentEvent(temp);
        if (isChain)
        {
            e = temp;
        }
        else
        {
            e = null;
        }

        SelectPrevious.SetNewMenu();
        interaction = null;
        secondObject = null;
        edit = null;
    }

}
