using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using TMPro;
using Packages.realityflow_package.Runtime.scripts;
using RealityFlow.Plugin.Scripts;
using System;

public class SubmitProject : MonoBehaviour
{
    public TextMeshProUGUI text;
    public void Submit()
    {
        FlowProject p = new FlowProject(Guid.NewGuid().ToString(), "adjust later", 12, text.text);
        Operations.CreateProject(p, ConfigurationSingleton.CurrentUser, (_, e) => { Debug.Log("Created Project " + e.message); });
    }
}
