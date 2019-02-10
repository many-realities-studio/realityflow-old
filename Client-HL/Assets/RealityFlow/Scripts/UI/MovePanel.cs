using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class MovePanel : MonoBehaviour {

    public const float PANEL_OFFSET = 737f;

    // Moves a panel a given number of screen-dependent pixels in a given direction
    // panel = -1 refers to the scene (left) panel
    // panel = 1 refers to the project (right) panel
    public void Move (int panel)
    {
        if ( (GetComponent<RectTransform>().offsetMin.x == PANEL_OFFSET * panel) || 
            (GetComponent<RectTransform>().offsetMax.x == PANEL_OFFSET * panel) )
        {
            Debug.Log("Gets here");
            // Set left, bottom RectTransform properties of panel
            GetComponent<RectTransform>().offsetMin = new Vector2(0, 0);
            // Set right, top RectTransform properties of panel
            GetComponent<RectTransform>().offsetMax = new Vector2(0, 0);
            // Bring panel to foreground
            GetComponent<RectTransform>().SetAsLastSibling();
        }
        else
        {
            // Set left, bottom RectTransform properties of panel
            GetComponent<RectTransform>().offsetMin = new Vector2(GetComponent<RectTransform>().offsetMin.x + PANEL_OFFSET * panel, 0);
            // Set right, top RectTransform properties of panel
            GetComponent<RectTransform>().offsetMax = new Vector2(GetComponent<RectTransform>().offsetMax.x + PANEL_OFFSET * panel, 0);
            // Send panel to background
            GetComponent<RectTransform>().SetAsFirstSibling();
        }
    }
}
