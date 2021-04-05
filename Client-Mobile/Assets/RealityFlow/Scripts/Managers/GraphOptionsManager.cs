using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using TMPro;

public class GraphOptionsManager : MonoBehaviour
{
    bool startDetectingTouch = false;
    Vector2 nodePosition;
    public GameObject nodePlacementPopup;
    TMP_Dropdown addNodeTypeMenu;
    TMP_Dropdown graphCommandsMenu;

    public RealityFlowGraphView realityFlowGraphView;
    public VSGraphSelectionDropdown vsGraph;
    public SelectComparison boolSelection;

    // The reason this is being used is because in RealityFlowGraphView the node position is multiplied by this hardcoded
    // canvas dimensions. So in order to compansate for this I am dividing by the canvas hardcoded dimensions.
    public Vector2 canvasDimensions = new Vector2(2000, 1080); // FOR NOW, dont have these hardcoded in final demo

    // Start is called before the first frame update
    void Start()
    {
         addNodeTypeMenu = GameObject.FindWithTag("NodeOptionsDropdown").GetComponent<TMP_Dropdown>();
         graphCommandsMenu =  GameObject.FindWithTag("GraphCommandsDropdown").GetComponent<TMP_Dropdown>(); 

         graphCommandsMenu.onValueChanged.AddListener(delegate {
            GraphOptionsSwitch();
        });

        addNodeTypeMenu.onValueChanged.AddListener(delegate {
            StartCoroutine("NodeCreationSwitch");
        });
    }

    void Update()
    {
        if(startDetectingTouch)
        {
            if (Input.GetMouseButtonDown(0))
            {
                 Vector2 mousePos = Input.mousePosition;
                 Debug.Log(mousePos);
                 //nodePosition = new Vector2(mousePos.x, mousePos.y); // This is the correct form. See node by canvasDimension declaration 
                 nodePosition = new Vector2(mousePos.x / canvasDimensions.x, mousePos.y / canvasDimensions.y);
                 startDetectingTouch = false;
            }
        }
    }

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
            case "Load Graph":
                vsGraph.LoadGraphs();
                Debug.Log("Load Graph called from GraphOptionsSwitch");
				break;
			default:
				Debug.Log("No valid option selected.");
				break; 
		}
        graphCommandsMenu.value = 0;
    }

    private IEnumerator NodeCreationSwitch()
    {
        // Turns on node placement popup
        nodePlacementPopup.SetActive(!nodePlacementPopup.activeInHierarchy);
        Debug.Log(startDetectingTouch);
        
        while(nodePlacementPopup.activeInHierarchy)
        {
            yield return null;
        }

        if(!nodePlacementPopup.activeInHierarchy)
        {
            startDetectingTouch = true;
            while(startDetectingTouch)
            {
                yield return null;
            }
            Debug.Log("Node placement: " + nodePosition);   
            realityFlowGraphView.SetNewNodeLocation(nodePosition);
        
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

    private IEnumerator WaitForPosition()
    {
        while(nodePosition == null)
        {
            yield return null;
        }
        Debug.Log(nodePosition);    
    }

    public void SetNodePositionStarter()
    {
        StartCoroutine("NodePositionSetter");
    }
    private IEnumerator NodePositionSetter()
    {
        // Turns on node placement popup
        nodePlacementPopup.SetActive(!nodePlacementPopup.activeInHierarchy);
        Debug.Log(startDetectingTouch);
        
        while(nodePlacementPopup.activeInHierarchy)
        {
            yield return null;
        }

        if(!nodePlacementPopup.activeInHierarchy)
        {
            startDetectingTouch = true;
            while(startDetectingTouch)
            {
                yield return null;
            }
            Debug.Log("Node placement: " + nodePosition);   
            realityFlowGraphView.SetNewNodeLocation(nodePosition);
            boolSelection.GetDropDownValue();
        }
    }
}
