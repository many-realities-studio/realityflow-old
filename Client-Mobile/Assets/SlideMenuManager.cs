using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class SlideMenuManager : MonoBehaviour
{
    private GameObject buttonContent;

    public void Awake()
    {
        buttonContent = GameObject.FindGameObjectWithTag("SlideMenuButtons");
    }
    public void ToggleMenuButtons(bool status)
    {
        foreach(Transform child in transform)
        {
            child.GetComponent<Selectable>().interactable = status;
        }

        
    }
}
