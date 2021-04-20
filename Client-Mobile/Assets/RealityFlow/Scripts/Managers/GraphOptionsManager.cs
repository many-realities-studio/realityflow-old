using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using TMPro;

// This function handles the GraphView Canvas Operations
public class GraphOptionsManager : MonoBehaviour
{
    Vector2 nodePosition = new Vector2(0, 0);
    TMP_Dropdown addNodeTypeMenu;
    TMP_Dropdown graphCommandsMenu;

    public NewRealityFlowMenu realityFlowMenu;
    public SketchfabModuleManager sketchfabModuleManager;
    public RealityFlowGraphView realityFlowGraphView;
    public GameObject VSGraphDropdownCanvas;
    public KeyboardManager keyboard;

    // Retrieves the dropdowns in the GraphView Canvas and set listeners for them when they change.
    void Start()
    {
        addNodeTypeMenu = GameObject.FindWithTag("NodeOptionsDropdown").GetComponent<TMP_Dropdown>();
        graphCommandsMenu =  GameObject.FindWithTag("GraphCommandsDropdown").GetComponent<TMP_Dropdown>(); 

        graphCommandsMenu.onValueChanged.AddListener(delegate {
            GraphOptionsSwitch();
        });

        addNodeTypeMenu.onValueChanged.AddListener(delegate {
            realityFlowGraphView.SetNewNodeLocation(nodePosition);
            NodeCreationSwitch();
        });

    }

    // This function handles the various graph functions by getting the item from the
    // Drop down then then calling that appropriate function in realityFlowGraphView script.
    public void GraphOptionsSwitch()
    {
        if(graphCommandsMenu.value == 0)
        {
            return;
        }

        switch(graphCommandsMenu.options[graphCommandsMenu.value].text.ToString())
		{
			case "Add Parameter":
                realityFlowGraphView.AddParameter();
                // Debug.Log("Add Parameter called from GraphOptionsSwitch");
				break;
            case "Undo":
                realityFlowGraphView.UndoLastCommand();
                // Debug.Log("Undo called from GraphOptionsSwitch");
                break;
            case "Delete Selected":
                realityFlowGraphView.DeleteSelection();
                // Debug.Log("Delete Selected called from GraphOptionsSwitch");
				break;
            case "Run Graph":
                realityFlowGraphView.DoProcessing();
                // Debug.Log("Run Graph called from GraphOptionsSwitch");
				break;
            case "Create Graph":
                realityFlowMenu.ShowHideCreateVSGraph();
                // Debug.Log("Create Graph called from GraphOptionsSwitch");
				break;
            case "Delete Graph":
                realityFlowMenu.LoadGraphsToDelete();
                // Debug.Log("Delete Graph called from GraphOptionsSwitch");
				break;
            case "Create Object":
                realityFlowMenu.ShowHideCreateObject();
                // Debug.Log("Create Object called from GraphOptionsSwitch");
				break;
            case "Delete Object":
                realityFlowMenu.LoadObjectsToDelete();
                // Debug.Log("Delete Object called from GraphOptionsSwitch");
				break;
            case "Clear Graph":
                realityFlowGraphView.ClearGraph();
                // Debug.Log("Clear Graph called from GraphOptionsSwitch");
				break;
            case "Load Graph":
                VSGraphDropdownCanvas.SetActive(true);
		        VSGraphDropdownCanvas.GetComponent<VSGraphSelectionDropdown>().LoadGraphs();
                // Debug.Log("Load Graph called from GraphOptionsSwitch");
				break;
            case "SketchFab Importer":
                sketchfabModuleManager.ToggelSketchfabModule();
                // Debug.Log("SketchFab Importer called from GraphOptionsSwitch");
				break;
			default:
				Debug.Log("No valid option selected.");
				break; 
		}
        graphCommandsMenu.value = 0;
    }

    // This function handles the various node types  from the drop down then then calling 
    // that appropriate node creation type in realityFlowGraphView script.
    public void NodeCreationSwitch()
    {
        realityFlowGraphView.SetNewNodeLocation(nodePosition);
        switch(addNodeTypeMenu.options[addNodeTypeMenu.value].text.ToString())
        {
             case "Print Node":
                realityFlowGraphView.AddNodeCommand("PrintNode");
                // Debug.Log("Print Node created from GraphOptionsSwitch");
                break;
            case "Text Node":
                realityFlowGraphView.AddNodeCommand("TextNode");
                // Debug.Log("Text Node created from GraphOptionsSwitch");
                break;
            case "Float Node":
                realityFlowGraphView.AddNodeCommand("FloatNode");
                // Debug.Log("Float Node created from GraphOptionsSwitch");
                break;
            case "Int Node":
                realityFlowGraphView.AddNodeCommand("IntNode");
                // Debug.Log("Int Node created from GraphOptionsSwitch");
                break;
            case "Bool Node":
                realityFlowGraphView.AddNodeCommand("BoolNode");
                // Debug.Log("Bool Node created from GraphOptionsSwitch");
                break;
            case "Start Node":
                realityFlowGraphView.AddNodeCommand("StartNode");
                // Debug.Log("Start Node created from GraphOptionsSwitch");
                break;
            case "If() Node":
                realityFlowGraphView.AddNodeCommand("ConditionalNode");
                // Debug.Log("Conditional Node created from GraphOptionsSwitch");
                break;
             case "Modify Node":
                realityFlowGraphView.AddNodeCommand("GameObjectManipulationNode");
                // Debug.Log("GameObjectManipulation Node created from GraphOptionsSwitch");
                break;
            default:
                // Debug.Log("No valid node option selected.");
                break;
        }
        addNodeTypeMenu.value = 0;
    }
}
