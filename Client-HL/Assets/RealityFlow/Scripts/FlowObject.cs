using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class FlowObject : MonoBehaviour {
	FlowTransform ft;
	FlowTransformCommand cmd = new FlowTransformCommand();
	// Use this for initialization
	void Start () {
	ft = new FlowTransform(gameObject);
	cmd.transform = ft;
	}
	
	// Update is called once per frame
	void Update () {
		if(FlowNetworkManager.connection_established) {
			((FlowTransform)cmd.transform).Read(gameObject);
			
			CommandProcessor.sendCommand(cmd);
		}
	}
}
