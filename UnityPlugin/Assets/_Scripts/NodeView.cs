using System.Collections;
using System.Collections.Generic;
using RealityFlow.Plugin.Contrib;
using UnityEngine;
using UnityEngine.UI;

public class NodeView : MonoBehaviour {
    public BaseGraph curGraph;
    GameObject contentPanel;
    public GameObject nodeView;
    public GameObject nodePortView;
    public List<NodeUI> nodeViewList = new List<NodeUI> ();
    public static NodeView instance;
    // Start is called before the first frame update
    void Awake () {
        instance = this;
    }
    public void AddNode (BaseNode node) {
        StartCoroutine (AddNodeCoroutine(node));
    }

    /*public void LoadGraph(BaseGraph graph){
        // Loading from graph is working, need to have it accept any type of node type though
        Debug.Log("Loading Graph");
        Debug.Log(JsonUtility.ToJson(graph));
        foreach(GameObject w in ButtonClick.WhiteBoards)
        {
            contentPanel = w.transform.GetChild(0).GetChild(0).GetChild(0).GetChild(0).gameObject;
            foreach (BaseNode node in graph.nodes){
                AddNode(node);
            }
        }
        // TODO: fill this method to load graphs from input graph
    }*/

    public IEnumerator AddNodeCoroutine (BaseNode node) {
        //NodeUI newView = new NodeUI(node.name,node,node.GUID.Substring (node.GUID.Length - 5));
        NodeUI newView = Instantiate (nodeView, new Vector3 (), Quaternion.identity).GetComponent<NodeUI> ();
        newView.gameObject.transform.SetParent (contentPanel.transform, false);
        newView.title.text = node.name;
        newView.node = node;
        newView.GUID.text = node.GUID.Substring (node.GUID.Length - 5);
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
        // nodeViewList.Add (newView);
        LayoutRebuilder.MarkLayoutForRebuild ((RectTransform) newView.transform);
        newView.gameObject.GetComponent<RectTransform> ().SetAsLastSibling ();
        contentPanel.GetComponent<VerticalLayoutGroup>().enabled = false;
        yield return new WaitForSeconds (.01f);
        contentPanel.GetComponent<VerticalLayoutGroup>().enabled = true;
        contentPanel.GetComponent<ContentSizeFitter>().enabled = true;
        LayoutRebuilder.MarkLayoutForRebuild ((RectTransform) contentPanel.transform);
    }

}
