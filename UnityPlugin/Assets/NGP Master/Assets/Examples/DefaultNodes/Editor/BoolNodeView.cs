using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEditor;
using UnityEditor.UIElements;
using UnityEditor.Experimental.GraphView;
using UnityEngine.UIElements;
using GraphProcessor;

[NodeCustomEditor(typeof(BoolNode))]
public class BoolNodeView : BaseNodeView
{
	public override void Enable()
	{
		hasSettings = true;	// or base.Enable();
		var node = nodeTarget as BoolNode;

        // Create your fields using node's variables and add them to the controlsContainer

		controlsContainer.Add(new Label($"Last Evaluation: {node.getValue()}"));
	}
}