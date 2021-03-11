using System;
using System.Collections;
using System.Collections.Generic;
using RealityFlow.Plugin.Contrib;
using UnityEditor;
using UnityEngine;
using UnityEngine.UIElements;

public class ButtonClickTest : MonoBehaviour {
	public BaseGraph graph;
	public BaseGraph graph1;
	public bool inputGraph;
	public ProcessGraphProcessor processor;

	public GameObject Labeled;

	private void Start () {
		if (inputGraph) {
			// graph1.AddExposedParameter ("LabelContainer", typeof (GameObject), Labeled);
			processor = new ProcessGraphProcessor (graph1);
			graph1.SetParameterValue ("LabelContainer", Labeled);
		}
	}

	public void AddNode() {
			TextNode tn = BaseNode.CreateFromType<TextNode> (new Vector2 ());
			graph.AddNode (tn);
			tn.output = "Hello World";
			NodeView.instance.AddNode(tn);
    }

	public void CreateGraph () {
		// graph.SetDirty();
		graph.AddExposedParameter ("LabelContainer", typeof (GameObject), Labeled);
		TextNode tn = BaseNode.CreateFromType<TextNode> (new Vector2 ());
		graph.AddNode (tn);
		tn.output = "Hello World";
		NodeView.instance.AddNode(tn);
		SetLabelNode sln = BaseNode.CreateFromType<SetLabelNode> (new Vector2 ());
		graph.AddNode (sln);
		graph.Connect (sln.GetPort ("newLabel", null), tn.GetPort ("output", null));
		NodeView.instance.AddNode(sln);
		ParameterNode pn = BaseNode.CreateFromType<ParameterNode> (new Vector2 ());

		pn.parameterGUID = graph.GetExposedParameter ("LabelContainer").guid;
		graph.AddNode (pn);
		graph.Connect (sln.GetPort ("input", ""), pn.GetPort ("output", "output"));
		NodeView.instance.AddNode(pn);
		graph.UpdateComputeOrder ();
		// graph.ed
		// graph.SetParameterValue ("LabelContainer", Labeled);
		processor = new ProcessGraphProcessor (graph);
		NodeView.instance.curGraph = graph;
    }
	public void ClearGraph () {
		while (graph.nodes.Count > 0) {
			graph.RemoveNode (graph.nodes[0]);
		}
		while (graph.exposedParameters.Count > 0) {
			graph.RemoveExposedParameter (graph.exposedParameters[0]);
		}
			//graph.SetDirty();
        // EditorWindow.GetWindow<CustomToolbarGraphWindow> ().InitializeGraph (graph as BaseGraph)
    }
	public void DoProcessing () {
		processor.Run ();
	}

}
