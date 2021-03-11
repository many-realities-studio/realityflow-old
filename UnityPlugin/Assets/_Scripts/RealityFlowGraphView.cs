using System;
using System.Collections;
using System.Collections.Generic;
using RealityFlow.Plugin.Contrib;
using UnityEditor;
using UnityEngine;
using UnityEngine.UIElements;
using System.Linq;

public class RealityFlowGraphView : MonoBehaviour {
	public BaseGraph graph;
	public BaseGraph graph1;

	private JsonElement savePoint; 
	public bool inputGraph;
	public ProcessGraphProcessor processor;

	public static CommandPalette commandPalette;

	public GameObject Labeled;

	public EdgeListener listener; // create a variable for edge listening


	// protected virtual EdgeListener CreateEdgeConnectorListener()
		//  => new EdgeListener(this);

    //public RealityFlowGraphView instance;

	List<BaseNode> selected;

	private void Start () {
		InitializeGraph();
	}

	void InitializeGraph(){

		// listener = CreateEdgeConnectorListener();
		//instance = this;
		if (inputGraph) {
			// graph1.AddExposedParameter ("LabelContainer", typeof (GameObject), Labeled);
			processor = new ProcessGraphProcessor (graph1);
			graph1.SetParameterValue ("LabelContainer", Labeled);
		}
		commandPalette = GameObject.Find("CommandPalette").GetComponent<CommandPalette>();
		// commandPalette = new CommandPalette();
        graph.onGraphChanges += GraphChangesCallback;
		savePoint = JsonSerializer.Serialize(graph);
		selected = new List<BaseNode>();
		Debug.Log("hello");
		NodeView.instance.LoadGraph(graph);
	}

    void GraphChangesCallback(GraphChanges changes)
    {
		// TODO have this event redraw the graph UI
		// Debug.Log(JsonSerializer.Serialize(graph));
        if(changes.addedNode != null)
        {
            // Debug.Log("Added a node "+changes.addedNode);
            //Undo.RegisterCompleteObjectUndo(graph,"Added Node RF");
			// commandPalette.AddCommandToStack(new AddNodeCommand("Add Node", changes,graph));
            // Debug.Log("Serialized changes:" + JsonSerializer.Serialize(changes.addedNode));
        }
        if(changes.removedNode != null)
        {
            // Debug.Log("Removed node "+JsonSerializer.Serialize(changes.removedNode));
			// commandPalette.AddCommandToStack(new DeleteNodeCommand("Remove Node", changes.removedNode));
        }
		if (changes.nodeChanged != null)
		{
			// Debug.Log(JsonSerializer.Serialize(changes.nodeChanged));
		}
		// Debug.Log(JsonSerializer.Serialize(changes));
        // Debug.Log("Serialized changes:" + JsonSerializer.Serialize(changes));

		// TODO: Add command to palette here instead
    }

	public void UndoLastCommand(){
		// get the command itself
		Command cmd;
		// cmd = commandPalette.GetCommandStack()[0];
		// cmd = commandPalette.GetCommandStack()[commandPalette.GetCommandStack().Count-1];
		cmd = commandPalette.GetCommandStack()[0];
		// Debug.Log(cmd.PrintCommand());
		JsonUtility.FromJsonOverwrite(cmd.GetGraphState(), graph);
		graph.Deserialize();
	}

	public void AddNodeCommand(){
		// serialize the current version of the graph
		// savePoint = JsonSerializer.Serialize(graph);
		string tmp = JsonUtility.ToJson(graph);

		// send this to the command palette
		commandPalette.AddCommandToStack(new AddNodeCommand("Add Node", tmp));

		// perform the actual command action
        TextNode tn = BaseNode.CreateFromType<TextNode> (new Vector2 ());
		graph.AddNode (tn);
		tn.output = "Hello World";
		NodeView.instance.AddNode(tn);
	}
	public void DeleteSelection(){
		// serialize the current version of the graph
		string tmp;
		tmp = JsonUtility.ToJson(graph);
		// tmp = JsonSerializer.Serialize(graph);
		// tmp.jsonDatas = JsonUtility.ToJson(graph);

		// BaseGraph preCmd = graph;
		// JsonUtility.FromJsonOverwrite(tmp, preCmd);

		// send this to the command palette
		commandPalette.AddCommandToStack(new DeleteNodeCommand("Delete Selection of Nodes", tmp));

		// 3. Perform the command's action
		foreach( BaseNode n in selected){
			graph.RemoveNode(n);
		}

		// BaseGraph postCmd = graph;
		// JsonUtility.FromJsonOverwrite(tmp, postCmd);
		// iterate over list
			// remove all nodes from the graph.
			// remove all their edges
			// remove any selected exposed params
	}
	/* MARKED FOR DELETION
	public BaseNode AddNodenoStack(){
		// initialize a command (Well need to receive more information from the GUI to fill out the Command Object)
		// then send it to the palette
		TextNode tn = BaseNode.CreateFromType<TextNode> (new Vector2 ());
		graph.AddNode (tn);
		tn.output = "Hello World";
		NodeView.instance.AddNode(tn);
        return tn;
	}*/

	public void PrintCommandStack(){
		// Debug.Log("Print stack disabled until we get UI elements in vr");
		commandPalette.PrintStack();
	}

	public void AddToSelection(BaseNode n){
		selected.Add(n);
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

		// TODO: graphs don't have GUIDs....
		// commandPalette.AddCommandToStack(new Command("Clear Graph", "NO GUID"));
    }

    public List <BaseNode> GetNodes()
    {
        Debug.Log("There are "+graph.nodes.Count+" inside runtimegraph");
        return graph.nodes;
    }
	public void DoProcessing () {
		processor.Run ();
	}

}
