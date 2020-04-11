using Behaviours;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class SelectPreviousMenu : MonoBehaviour
{
    public GameObject previousMenu;

    public BehaviourEvent e;

    public string remove;

    public void SetPreviousMenu(GameObject g)
    {
        previousMenu = g;
    }

    public void SetCurrentEvent(BehaviourEvent be)
    {
        e = be;
    }

    public BehaviourEvent GetCurrentEvent()
    {
        return e;
    }

    public void SetRemove(string r)
    {
        remove = r;
    }
    
    public void EnablePreviousMenu()
    {
        previousMenu.SetActive(true);
    }
}
