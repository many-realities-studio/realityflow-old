using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using TMPro;

public class MovePanel : MonoBehaviour {

    public TMP_Dropdown panelMenu;
    public GameObject objectInteractionItems;
    public GameObject[] panelList;
    public const float PANEL_OFFSET = 737f;

    void Start()
    {
        panelMenu.onValueChanged.AddListener(delegate {
            TogglePanel();
        });

    }

    // Moves a panel a given number of screen-dependent pixels in a given direction
    // panel = -1 refers to the scene (left) panel
    // panel = 1 refers to the project (right) panel
    /*
    public void Move (int panel)
    {
        if ( (GetComponent<RectTransform>().offsetMin.x == PANEL_OFFSET * panel) || 
            (GetComponent<RectTransform>().offsetMax.x == PANEL_OFFSET * panel) )
        {
            TogglePanel();
            // Set left, bottom RectTransform properties of panel
            GetComponent<RectTransform>().offsetMin = new Vector2(0, 0);
            // Set right, top RectTransform properties of panel
            GetComponent<RectTransform>().offsetMax = new Vector2(0, 0);
            // Bring panel to foreground
            GetComponent<RectTransform>().SetAsLastSibling();
        }
        else
        {
            TogglePanel();
            // Set left, bottom RectTransform properties of panel
            GetComponent<RectTransform>().offsetMin = new Vector2(GetComponent<RectTransform>().offsetMin.x + PANEL_OFFSET * panel, 0);
            // Set right, top RectTransform properties of panel
            GetComponent<RectTransform>().offsetMax = new Vector2(GetComponent<RectTransform>().offsetMax.x + PANEL_OFFSET * panel, 0);
            // Send panel to background
            GetComponent<RectTransform>().SetAsFirstSibling();
        }
    }
    */

    // Turns on the Project or Scene Panels in the Root View Canavas
    public void TogglePanel()
    {
        for(int i = 0; i < panelList.Length; i++)
        {
            if(panelList[i].name == panelMenu.options[panelMenu.value].text.ToString())
            {
                objectInteractionItems.SetActive(false);
                panelList[i].SetActive(true);
            }
        }
        panelMenu.value = 0;
    }

    // Turns off the Project or Scene Panels in the Root View Canavas
    public void closePanel()
    {
        transform.parent.gameObject.SetActive(false);
        objectInteractionItems.SetActive(true);

    }
}
