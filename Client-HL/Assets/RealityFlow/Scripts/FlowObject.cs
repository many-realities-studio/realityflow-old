using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class FlowObject : MonoBehaviour {
    FlowTransform ft;
	// Use this for initialization
	void Start () {
        ft = new FlowTransform(this.gameObject);
        if(FlowProject.activeProject != null)
            ft.RegisterTransform();
        else
        {
            if(FlowNetworkManager.toBeAdded == null)
            {
                FlowNetworkManager.toBeAdded = new List<FlowObject>();
                FlowNetworkManager.toBeAdded.Add(this);
            }
        }

	}
    public void Initialize()
    {
        ft.RegisterTransform();
    }
    // Update is called once per frame
    void Update () {
        if (FlowNetworkManager.connection_established)
        {
            FlowTransformCommand cmd = new FlowTransformCommand();
            cmd.transform = ft;
            CommandProcessor.sendCommand(new FlowTransformCommand());
        }
	}
}
