using System.Collections;
using System.Collections.Generic;
using System.Linq;
using RealityFlow.Plugin.Contrib;
using UnityEngine;
using UnityEngine.UI;

[System.Serializable, NodeMenuItem ("Custom/SetLabelNode")]
public class SetLabelNode : BaseNode {
	[Input (name = "String")]
	public string newLabel;
	[Input (name = "In")]
	public GameObject input;

	public override string name => "SetLabelNode";

	protected override void Process () {
		input.GetComponent<Text>().text = newLabel;
	}
}