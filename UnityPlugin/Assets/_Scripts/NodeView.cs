using System.Collections;
using System.Collections.Generic;
using GraphProcessor;
using UnityEngine;
using UnityEngine.UI;

public class NodeView : MonoBehaviour {
    public BaseGraph curGraph;
    public GameObject contentPanel;
    public GameObject nodeView;
    public GameObject nodePortView;
    public List<NodeUI> nodeViewList = new List<NodeUI> ();
    public static NodeView instance;
    // Start is called before the first frame update
    void Start () {
        instance = this;
    }
    public void AddNode (BaseNode node) {
        StartCoroutine (AddNodeCoroutine(node));
    }
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
