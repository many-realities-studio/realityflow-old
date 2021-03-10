using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using GraphProcessor;
public class NodeUI : MonoBehaviour
{
    public Text title;
    public Text GUID;
    public GameObject inputPanel;
    public GameObject outputPanel;
    public BaseNode node;

    // TODO: Make sure this is the best way to do this. I think this is really hacky -John
    // public BaseGraph graph;

    // public GameObject rfgvGameObject; // realityflowgraphview script
    public RealityFlowGraphView rfgv;

    public static NodeUI instance;

    // static List <BaseNode> deletionList;

    // Start is called before the first frame update
    /*public NodeUI(string title, BaseNode node, string GUID){
        this.title.text = title;
        this.node = node;
        this.GUID.text = GUID;
    }*/
    void Awake()
    {
        instance = this;
    }
    void Start()
    {   
        // deletionList = new List<BaseNode>();
    }

    // public void Setup(RealityFlowGraphView rfgvi)
    // {
    //     rfgv=rfgvi;
    //     graph = rfgvi.graph;
    // }



    public void Delete(){
        rfgv.graph.RemoveNode(node);
        // _____?.Invoke(node);
        //graph.SetDirty();
        Destroy(this.gameObject);
    }

    public void Select(){
    //    rfgv.AddToSelection(node);
       rfgv.AddToSelectionNV(this);
       this.GetComponent<CanvasRenderer>().SetColor(Color.green);
    }
    /*
    public void Delete() {
        deletionList.Add(node);
    }
    public void DeleteAll(){
        Debug.Log("Deletion list contains "+deletionList.Count);
        foreach(BaseNode n in deletionList)
        {
            RuntimeGraph.commandPalette.AddCommandToStack(new Command("Remove Node", n.GUID));
            graph.RemoveNode(n);
            //graph.SetDirty();
            Destroy(gameObject);
        }
    }
    */
}
