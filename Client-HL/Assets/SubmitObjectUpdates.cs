using Behaviours;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class SubmitObjectUpdates : MonoBehaviour
{
    private GameObject tiedTo;

    private string interaction;

    private BehaviourEvent e;
    private GameObject secondObject;
    public GameObject secondObjectPrompt;

    public void AttachToObject(GameObject go)
    {
        NetworkManagerHL nm = FindObjectOfType<NetworkManagerHL>();
        if (nm.CheckedOutIsNull())
        {
            tiedTo = go;
            transform.position = go.transform.position;
            transform.LookAt(Camera.main.transform);
            
            nm.UpdateCheckedOut(go);

            gameObject.SetActive(true);
        }
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
        // code to call interaction making
        interaction = null;
        secondObject = null;
    }

}
