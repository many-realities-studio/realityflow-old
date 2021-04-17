using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.EventSystems;

public class DragDrop : MonoBehaviour, IDragHandler, IEndDragHandler
{
    private Vector2 panelDimension;
    private NodeView nodeView;

    public void OnDrag(PointerEventData data)
    {
        Vector2 mousePos = Input.mousePosition;
        transform.localPosition = new Vector3(Input.mousePosition.x + 1000, Input.mousePosition.y - 500, transform.localPosition.z);
    }

    public void OnEndDrag(PointerEventData eventData)
    {
        nodeView = this.gameObject.GetComponent<NodeView>();
        nodeView.ResetOrientation();
        nodeView.UpdateNodeValues();
        nodeView.RedrawEdges(true);
    }
}
