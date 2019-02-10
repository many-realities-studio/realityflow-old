using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class FlowObject : MonoBehaviour {
	FlowTransform ft;
	FlowTransformCommand cmd = new FlowTransformCommand();
	// Use this for initialization
	void Start () {
	ft = new FlowTransform(gameObject);
	ft.id = "1";
	ft._id = "1";
	cmd.transform = ft;
	FlowObject.fo = this;
	}
	public static FlowObject fo;
	public static void registerObject() {
		fo.ft.RegisterTransform();
	}
	
	// Update is called once per frame
	void Update () {
		if(FlowNetworkManager.connection_established) {
			((FlowTransform)cmd.transform).Read(gameObject);
			CommandProcessor.sendCommand(cmd);
		}
	}
}
