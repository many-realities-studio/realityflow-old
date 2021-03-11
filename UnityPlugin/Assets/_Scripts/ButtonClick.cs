using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using RealityFlow.Plugin.Contrib;
using NodeGraphProcessor.Examples;

public class ButtonClick : MonoBehaviour
{
	public BaseGraph graph;
	public BaseGraph graph1;
	public bool inputGraph;
	public ProcessGraphProcessor processor;

	public GameObject Labeled;

    public Button nodeButton;
    // Start is called before the first frame update
    void Start()
    {
		if (inputGraph) {
			// graph1.AddExposedParameter ("LabelContainer", typeof (GameObject), Labeled);
			processor = new ProcessGraphProcessor (graph1);
			graph1.SetParameterValue ("LabelContainer", Labeled);
		}
        CreateGraph();
        //AddNode();
        //GenerateGraph();
        Button btn = nodeButton.GetComponent<Button>();
		btn.onClick.AddListener(RunGraph);
    }
    void RunGraph()
    {
        //ProcessGraphProcessor processor = new ProcessGraphProcessor(graph);
        processor.Run();
    }
    void GenerateGraph()
    {
        TextNode tn = BaseNode.CreateFromType<TextNode> (new Vector2 ());
		graph.AddNode (tn);
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

    public void AddNode() {
		TextNode tn = BaseNode.CreateFromType<TextNode> (new Vector2 ());
		graph.AddNode (tn);
		tn.output = "Hello World";
        if(NodeView.instance==null)
        {
            Debug.Log("NodeView is NULL");
        }
		NodeView.instance.AddNode(tn);
    }
}
