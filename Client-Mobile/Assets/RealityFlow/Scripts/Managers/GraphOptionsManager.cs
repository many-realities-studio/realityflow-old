using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using TMPro;

public class GraphOptionsManager : MonoBehaviour
{
    TMP_Dropdown addNodeTypeMenu;
    TMP_Dropdown graphCommandsMenu;

    public RealityFlowGraphView realityFlowGraphView;

    // Start is called before the first frame update
    void Start()
    {
         addNodeTypeMenu = GameObject.FindWithTag("NodeOptionsDropdown").GetComponent<TMP_Dropdown>();
         graphCommandsMenu =  GameObject.FindWithTag("GraphCommandsDropdown").GetComponent<TMP_Dropdown>(); 

         graphCommandsMenu.onValueChanged.AddListener(delegate {
            GraphOptionsSwitch();
        });

        addNodeTypeMenu.onValueChanged.AddListener(delegate {
            NodeCreationSwitch();
        });
    }

    public void GraphOptionsSwitch()
    {
        switch(graphCommandsMenu.options[graphCommandsMenu.value].text.ToString())
		{
			case "Add Parameter":
                realityFlowGraphView.AddParameter();
                Debug.Log("Add Parameter called from GraphOptionsSwitch");
				break;
            case "Undo":
                realityFlowGraphView.UndoLastCommand();
                Debug.Log("Undo called from GraphOptionsSwitch");
                break;
            case "Delete Selected":
                realityFlowGraphView.DeleteSelection();
                Debug.Log("Delete Selected called from GraphOptionsSwitch");
				break;
            case "Run Graph":
                realityFlowGraphView.DoProcessing();
                Debug.Log("Run Graph called from GraphOptionsSwitch");
				break;
            case "Create Graph":
                realityFlowGraphView.CreateGraph();
                Debug.Log("Create Graph called from GraphOptionsSwitch");
				break;
            case "Clear Graph":
                realityFlowGraphView.ClearGraph();
                Debug.Log("Clear Graph called from GraphOptionsSwitch");
				break;
			default:
				Debug.Log("No valid option selected.");
				break; 
		}		
    }

    public void NodeCreationSwitch()
    {
        switch(addNodeTypeMenu.options[addNodeTypeMenu.value].text.ToString())
		{
            case "Text Node":
                realityFlowGraphView.AddNodeCommand("TextNode");
                Debug.Log("Text Node created from GraphOptionsSwitch");
				break;
            case "Float Node":
                realityFlowGraphView.AddNodeCommand("FloatNode");
                Debug.Log("Float Node created from GraphOptionsSwitch");
				break;
            case "Int Node":
                realityFlowGraphView.AddNodeCommand("IntNode");
                Debug.Log("Int Node created from GraphOptionsSwitch");
				break;
            case "Bool Node":
                realityFlowGraphView.AddNodeCommand("BoolNode");
                Debug.Log("Bool Node created from GraphOptionsSwitch");
				break;
            case "Conditional Node":
                realityFlowGraphView.AddNodeCommand("ConditionalNode");
                Debug.Log("Conditional Node created from GraphOptionsSwitch");
				break;
            default:
				Debug.Log("No valid node option selected.");
				break;
        }
    }
    
}
