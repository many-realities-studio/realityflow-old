using System;
using System.Collections;
using System.Collections.Generic;
using RealityFlow.Plugin.Contrib;
using UnityEditor;
using UnityEngine;
using UnityEngine.UI;
using UnityEngine.UIElements;
using System.Linq;


public class RealityFlowGraphView : MonoBehaviour {
	public BaseGraph graph;

	private JsonElement savePoint; 
	// public bool inputGraph;
	public ProcessGraphProcessor processor;

	public static CommandPalette commandPalette;
	public EdgeListener listener; // create a variable for edge listening

	public GameObject Labeled;
	public GameObject contentPanel;

	public GameObject nodePortView;
	public GameObject nodeView;

	public List<NodeUI> nodeViewList = new List<NodeUI> ();
	public List<NodeUI> selectedNV = new List<NodeUI>();
	public List<BaseNode> selected = new List<BaseNode>();


	// protected virtual EdgeListener CreateEdgeConnectorListener()
		//  => new EdgeListener(this);

    //public RealityFlowGraphView instance;


	private void Start () {
		InitializeGraph();
	}

	void InitializeGraph(){

		// listener = CreateEdgeConnectorListener();
		//instance = this;
		// if (inputGraph) {
		// 	// graph1.AddExposedParameter ("LabelContainer", typeof (GameObject), Labeled);
		// 	// processor = new ProcessGraphProcessor (graph1);
		// 	// graph1.SetParameterValue ("LabelContainer", Labeled);
		// }
		// TODO: have it create a new empty graph and use that as the graph
		graph = new BaseGraph();
		graph.name = "TEST GRAPH "+graph.GetInstanceID();
		commandPalette = GameObject.Find("CommandPalette").GetComponent<CommandPalette>();
		// commandPalette = new CommandPalette();
        graph.onGraphChanges += GraphChangesCallback;
		savePoint = JsonSerializer.Serialize(graph);
		// selected =
		Debug.Log("hello");
		// NodeView.instance.LoadGraph(graph);
		LoadGraph(graph);
	}

	protected void LoadGraph(BaseGraph graph){
		foreach (BaseNode node in graph.nodes ){
			StartCoroutine (AddNodeCoroutine(node));        }
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
 
	public void AddNodeCommand(string nodeTag){
		// serialize the current version of the graph
		// savePoint = JsonSerializer.Serialize(graph);
		string tmp = JsonUtility.ToJson(graph);

		// send this to the command palette
		commandPalette.AddCommandToStack(new AddNodeCommand("Add Node", tmp));

		// perform the actual command action
        //TextNode tn = BaseNode.CreateFromType<TextNode> (new Vector2 ());
		BaseNode node;
		switch(nodeTag)
		{
			case "TextNode":
				TextNode tn = BaseNode.CreateFromType<TextNode> (new Vector2 ());
				graph.AddNode (tn);
				tn.output = "Hello World";
				StartCoroutine (AddNodeCoroutine(tn));
				break;
			case "FloatNode":
				FloatNode fn = BaseNode.CreateFromType<FloatNode> (new Vector2 ());
				graph.AddNode (fn);
				fn.output = 0.5f;
				StartCoroutine (AddNodeCoroutine(fn));
				break;
			case "IntNode":
				IntNode intn = BaseNode.CreateFromType<IntNode> (new Vector2 ());
				graph.AddNode (intn);
				intn.output = 1;
				StartCoroutine (AddNodeCoroutine(intn));
				break;
			case "BoolNode":
				BoolNode bn = BaseNode.CreateFromType<BoolNode> (new Vector2 ());
				graph.AddNode(bn);
				bn.output = true;
				StartCoroutine (AddNodeCoroutine(bn));
				break;
			case "ConditionalNode":
				IfNode cn = BaseNode.CreateFromType<IfNode> (new Vector2 ());
				graph.AddNode(cn);
				StartCoroutine (AddNodeCoroutine(cn));
				break;
			default:
				Debug.Log("This case of addnode did not use a tag");
				break; 
		}		
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
		Debug.Log(selectedNV.Count);
		// foreach( BaseNode n in selected){
		// 	graph.RemoveNode(n);
		// }
		// selected.Clear();
		// TODO: Change deletion process so we use the NodeUI.guid to delete specific dictionary indicies instead of using a list (Requires we change our NodeView List into a dictionary).
		foreach( NodeUI n in selectedNV){
			n.Delete();
		}
		selectedNV.Clear();
		nodeViewList.RemoveAll(nv => nv==null);
		
		// BaseGraph postCmd = graph;
		// JsonUtility.FromJsonOverwrite(tmp, postCmd);
		// iterate over list
			// remove all nodes from the graph.
			// remove all their edges
			// remove any selected exposed params
	}

	public void PrintCommandStack(){
		// Debug.Log("Print stack disabled until we get UI elements in vr");
		commandPalette.PrintStack();
	}

	public void AddToSelection(BaseNode n){
		selected.Add(n);
	}

	public void AddToSelectionNV(NodeUI n){
		selectedNV.Add(n);
	}

	public void CreateGraph () {
		// graph.SetDirty();
		graph.AddExposedParameter ("LabelContainer", typeof (GameObject), Labeled);
		TextNode tn = BaseNode.CreateFromType<TextNode> (new Vector2 ());
		graph.AddNode (tn);
		tn.output = "Hello World";
		StartCoroutine (AddNodeCoroutine(tn));
		SetLabelNode sln = BaseNode.CreateFromType<SetLabelNode> (new Vector2 ());
		graph.AddNode (sln);
		graph.Connect (sln.GetPort ("newLabel", null), tn.GetPort ("output", null));
		StartCoroutine (AddNodeCoroutine(sln));
		ParameterNode pn = BaseNode.CreateFromType<ParameterNode> (new Vector2 ());

		pn.parameterGUID = graph.GetExposedParameter ("LabelContainer").guid;
		graph.AddNode (pn);
		graph.Connect (sln.GetPort ("input", ""), pn.GetPort ("output", "output"));
		StartCoroutine (AddNodeCoroutine(pn));
		graph.UpdateComputeOrder ();
		// graph.ed
		// graph.SetParameterValue ("LabelContainer", Labeled);
		processor = new ProcessGraphProcessor (graph);
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


	public IEnumerator AddNodeCoroutine (BaseNode node) {
        //NodeUI newView = new NodeUI(node.name,node,node.GUID.Substring (node.GUID.Length - 5));
        NodeUI newView = Instantiate (nodeView, new Vector3 (), Quaternion.identity).GetComponent<NodeUI> ();
        newView.gameObject.transform.SetParent (contentPanel.transform, false);
        newView.title.text = node.name;
        newView.node = node;
        newView.GUID.text = node.GUID.Substring (node.GUID.Length - 5);
		newView.rfgv = this;
        contentPanel.GetComponent<ContentSizeFitter>().enabled = false;
        foreach (NodePort input in node.inputPorts) {
            newView.GetComponent<ContentSizeFitter>().enabled = false;
            NodePortView npv = Instantiate (nodePortView).GetComponent<NodePortView> ();
            npv.gameObject.transform.SetParent (newView.inputPanel.transform, false);
            npv.gameObject.GetComponent<RectTransform> ().SetAsLastSibling ();
            yield return new WaitForSeconds (.01f);
            npv.Init (input);
            LayoutRebuilder.MarkLayoutForRebuild ((RectTransform) newView.transform);
            newView.GetComponent<ContentSizeFitter>().enabled = true;
        }
        foreach (NodePort output in node.outputPorts) {
            newView.GetComponent<ContentSizeFitter>().enabled = false;
            NodePortView npv = Instantiate (nodePortView).GetComponent<NodePortView> ();
            npv.gameObject.transform.SetParent (newView.outputPanel.transform,false);
            npv.gameObject.GetComponent<RectTransform> ().SetAsLastSibling ();
            yield return new WaitForSeconds (.01f);
            npv.Init (output);
            LayoutRebuilder.MarkLayoutForRebuild ((RectTransform) newView.transform);
            newView.GetComponent<ContentSizeFitter>().enabled = true;
        }
        nodeViewList.Add (newView);
        LayoutRebuilder.MarkLayoutForRebuild ((RectTransform) newView.transform);
        newView.gameObject.GetComponent<RectTransform> ().SetAsLastSibling ();
        contentPanel.GetComponent<VerticalLayoutGroup>().enabled = false;
        yield return new WaitForSeconds (.01f);
        contentPanel.GetComponent<VerticalLayoutGroup>().enabled = true;
        contentPanel.GetComponent<ContentSizeFitter>().enabled = true;
        LayoutRebuilder.MarkLayoutForRebuild ((RectTransform) contentPanel.transform);
    }

}
