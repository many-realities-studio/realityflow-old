using Assets.RealityFlow.Scripts.Events;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class CreateProject : MonoBehaviour
{
    public Text projName;

    public void createProject()
    {
        ProjectCreateEvent newProject = new ProjectCreateEvent();
        newProject.Send(projName.text);
        
    }
}
