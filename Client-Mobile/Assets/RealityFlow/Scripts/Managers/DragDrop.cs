using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.EventSystems;

// This class handles the drag and drop functionality of nodes in the graph view
// It is attached to the node prefab
public class DragDrop : MonoBehaviour, IDragHandler, IEndDragHandler
{
    private Vector2 panelDimension;
    private NodeView nodeView;

    void Start()
    {
        nodeView = this.gameObject.GetComponent<NodeView>();
        nodeView.isMobile = true;
    }

    // Once Unity detects draging it checks out the nodes and redraws the edges om real time.
    // It then sets the node position at whereever you let go.
    public void OnDrag(PointerEventData data)
    {
        nodeView.CheckOut();
        nodeView.RedrawEdges(true);
        Vector2 mousePos = Input.mousePosition;
        transform.localPosition = new Vector3(Input.mousePosition.x - 650, Input.mousePosition.y - 400, transform.localPosition.z);
    }

    public void OnEndDrag(PointerEventData eventData)
    {
        nodeView.ResetOrientation();
        nodeView.UpdateNodeValues();
        nodeView.RedrawEdges(true);
    }
}
