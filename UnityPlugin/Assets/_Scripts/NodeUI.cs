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
    public BaseGraph graph;

    static List <BaseNode> deletionList;

    // Start is called before the first frame update
    /*public NodeUI(string title, BaseNode node, string GUID){
        this.title.text = title;
        this.node = node;
        this.GUID.text = GUID;
    }*/
    void Start()
    {   

        //graph = RealityFlowGraphView.instance.graph;
        BaseGraph graph = GameObject.Find("RuntimeGraph").GetComponent<RealityFlowGraphView>().graph;
        deletionList = new List<BaseNode>();
    }

    // Update is called once per frame
    void Update()
    {
        
    }

    public void Delete(){
        graph.RemoveNode(node);
        //graph.SetDirty();
        Destroy(gameObject);
    }

    public void Select(){
        GameObject.Find("RuntimeGraph").GetComponent<RealityFlowGraphView>().AddToSelection(node);
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
