using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.EventSystems;

public class DragDrop : MonoBehaviour, IDragHandler
{
    public GameObject contentPanel;
    private Vector2 panelDimension;

    public void Start() 
    {
        contentPanel = this.gameObject.transform.parent.gameObject;
        this.gameObject.transform.position = contentPanel.transform.position;
        Debug.Log("Thsi POSITION " + this.gameObject.transform.position);
    }
    public void OnDrag(PointerEventData data)
    {
        Vector2 mousePos = Input.mousePosition;
        Debug.Log(mousePos);
        //nodePosition = new Vector2(mousePos.x, mousePos.y); // This is the correct form. See node by canvasDimension declaration 
                
        transform.localPosition = new Vector3(Input.mousePosition.x, Input.mousePosition.y, transform.localPosition.z);

    }
}
