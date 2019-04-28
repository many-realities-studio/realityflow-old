using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class MouseClick : MonoBehaviour {

    Color objColor;

    void OnMouseUpAsButton()
    {
        transform.parent.GetComponent<SelectedManger>().updateSelected(this.gameObject);
    }

    void OnMouseEnter()
    {
        objColor = GetComponent<MeshRenderer>().material.color;
        GetComponent<MeshRenderer>().material.color = Color.red;
    }
    void OnMouseExit()
    {
        GetComponent<MeshRenderer>().material.color = objColor;
    }
}
