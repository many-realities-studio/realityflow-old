using RealityFlow.Plugin.Scripts;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class SelectPreviousMenu : MonoBehaviour
{
    public List<GameObject> previousMenu = new List<GameObject>();
    private Transform coords;

    public GameObject cube;

    public FlowBehaviour e = null;
    public List<FlowBehaviour> previousEvent = new List<FlowBehaviour>();

    public FlowBehaviour remove;

    public FlowBehaviour edit;

    public GameObject menu1;
    public GameObject menu2;
    public GameObject mainMenu;

    public void SetEdit(FlowBehaviour ed)
    {
        edit = ed;
    }

    public void SetNewMenu()
    {
        if (true)
            menu2.SetActive(true);
        else
            mainMenu.SetActive(true);
    }

    public void RefreshMenu()
    {
        previousEvent.Clear();
    }

    public void SetCoords()
    {
        coords.position = cube.transform.position;
        coords.rotation = cube.transform.rotation;
        coords.localScale = cube.transform.lossyScale;
    }

    public Transform GetCoords()
    {
        return coords;
    }

    public void SetPreviousMenu(GameObject g)
    {
        previousMenu.Add(g);
    }

    public void SetCurrentEvent(FlowBehaviour be)
    {
        previousEvent.Add(e);
        e = be;
    }

    public void RefreshCurrentEvent()
    {
        e = null;
        previousEvent.Clear();
    }

    public FlowBehaviour GetCurrentEvent()
    {
        return e;
    }

    public void DeleteEvent()
    {
        FindObjectOfType<NetworkManagerHL>().DeleteBehaviour(remove);
    }

    public void SetRemove(FlowBehaviour r)
    {
        remove = r;
    }
    
    public FlowBehaviour EnablePrevious()
    {
        if (previousEvent.Count != 0)
        {
            e = previousEvent[previousEvent.Count - 1];
            previousEvent.RemoveAt(previousEvent.Count - 1);
        }
        return e;
    }

    public void SetMenu()
    {
        EnablePrevious();
        if (previousEvent.Count > 1)
        {
            menu2.SetActive(true);
        }
        else
        {
            menu1.SetActive(true);
        }
    }
}
