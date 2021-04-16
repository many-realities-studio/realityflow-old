using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using TMPro;

public class GraphOptionsManager : MonoBehaviour
{
    public Camera cameraObject;
    public RectTransform parentCanvas;
    public Renderer parent;
    bool setNodeStart = false;
    private Vector2 panelDimension;
    Vector3 nodePosition;
    public GameObject nodeContentPanel;
    TMP_Dropdown addNodeTypeMenu;
    TMP_Dropdown graphCommandsMenu;

    public RealityFlowGraphView realityFlowGraphView;
    public GameObject VSGraphDropdownCanvas;
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
        realityFlowGraphView.SetIsMobile();
    }

    void Update() 
    {
        if(!setNodeStart)
        {
            if(Input.GetMouseButtonDown(0))
            {
                // Vector2 mousePos = Input.mousePosition;
                // //panelDimension = cameraObject.WorldToScreenPoint(Input.mousePosition);
                // Vector3 [] cornerPos = new Vector3[4];
                // parentCanvas.GetComponent<RectTransform>().GetWorldCorners(cornerPos);
                // Debug.Log("Corners for Graph");
                // foreach(Vector3 corner in cornerPos){
                //     Debug.Log(corner);
                // }

                // nodePosition = new Vector2(mousePos.x / canvasDimensions.x, mousePos.y / canvasDimensions.y);
                // panelDimension = Input.mousePosition;

                panelDimension = new Vector2(parentCanvas.transform.localPosition.x, parentCanvas.transform.localPosition.y);
                realityFlowGraphView.SetNewNodeLocation(panelDimension);
                setNodeStart = true;
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
                VSGraphDropdownCanvas.SetActive(true);
		        VSGraphDropdownCanvas.GetComponent<VSGraphSelectionDropdown>().LoadGraphs();
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
        if(1 == 5)
        {
            yield return true;
        }
        
        switch(addNodeTypeMenu.options[addNodeTypeMenu.value].text.ToString())
        {
             case "Print Node":
                realityFlowGraphView.AddNodeCommand("PrintNode");
                Debug.Log("Print Node created from GraphOptionsSwitch");
                break;
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
            case "Start Node":
                realityFlowGraphView.AddNodeCommand("StartNode");
                Debug.Log("Start Node created from GraphOptionsSwitch");
                break;
            case "If() Node":
                realityFlowGraphView.AddNodeCommand("ConditionalNode");
                Debug.Log("Conditional Node created from GraphOptionsSwitch");
                break;
             case "Modify Node":
                realityFlowGraphView.AddNodeCommand("GameObjectManipulationNode");
                Debug.Log("GameObjectManipulation Node created from GraphOptionsSwitch");
                break;
            default:
                Debug.Log("No valid node option selected.");
                break;
        }
        addNodeTypeMenu.value = 0;
    }

    private IEnumerator WaitForPosition()
    {
        while(nodePosition == null)
        {
            yield return null;
        }
        Debug.Log(nodePosition);    
    }
}
