using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Selector : MonoBehaviour {

    public bool isSelected;
    Color hover = new Color(1f, 0.8f, 0f);
    Color selected = new Color(0f, 0.141f, 1f);

    private void Awake()
    {
        isSelected = false;
    }

    void OnMouseOver()
    {
        var outline = gameObject.GetComponent(typeof(Outline)) as Outline;

        if (outline != null && !isSelected)
        {
            outline.enabled = true;
            outline.OutlineColor = hover;
        }
    }

    void OnMouseExit()
    {
        var outline = gameObject.GetComponent(typeof(Outline)) as Outline;

        if (outline != null && !isSelected)
        {
            outline.enabled = false;
        }
    }

    void OnMouseDown()
    {
        var outline = gameObject.GetComponent(typeof(Outline)) as Outline;

        if (outline != null)
        {
            isSelected = true;
            outline.enabled = true;
            outline.OutlineColor = selected;            
        }
    }
}
