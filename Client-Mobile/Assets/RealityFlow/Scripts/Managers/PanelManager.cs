using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class PanelManager : MonoBehaviour
{
    [Header("Canvas")]
    // Canvas
    public GameObject graphViewCanvas;
    public GameObject listViewCanvas;

    [Header("Graph View Panels")]
    // Toggles
    public Toggle outputToggel;
    public Toggle paramToggel;

    // Panels
    public GameObject outputPanel;
    public GameObject paramPanel;

    public void OutputPanelToggel(){
        outputPanel.SetActive(!outputPanel.activeInHierarchy);
    }

    public void ParamPanelToggel(){
        paramPanel.SetActive(!paramPanel.activeInHierarchy);
    }
    public void ToggleListViewGraphView(){
        listViewCanvas.SetActive(!listViewCanvas.activeInHierarchy);
        graphViewCanvas.SetActive(!graphViewCanvas.activeInHierarchy);

    }
}
