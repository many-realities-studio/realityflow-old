using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

// This class handles the various Panels located in the RootView Canavas
public class PanelManager : MonoBehaviour
{
    private Vector3 mainCameraOriginPos;

    [Header("Canvas")]
    // Canvas
    public GameObject graphViewCanvas;
    public GameObject listViewCanvas;

    [Header("Graph View Panels")]
    // Toggles
    public Toggle outputToggel;
    public Toggle paramToggel;
    public Toggle cameraFollowToggel;

    // Panels
    public GameObject outputPanel;
    public GameObject paramPanel;

    // Camera Follow
    public GameObject cameraFollow;
    
    void Start() 
    {
        mainCameraOriginPos = GameObject.Find("Main Camera").transform.position;
    }

    // Various toggels for the panels that will be set in the inspector
    public void OutputPanelToggel(){
        outputPanel.SetActive(!outputPanel.activeInHierarchy);
    }

    public void ParamPanelToggel(){
        paramPanel.SetActive(!paramPanel.activeInHierarchy);
    }

    // Toggels betweens the Root View Canvas and the Graph View Canavas
    public void ToggleListViewGraphView(){
        listViewCanvas.SetActive(!listViewCanvas.activeInHierarchy);
        graphViewCanvas.SetActive(!graphViewCanvas.activeInHierarchy);
    }

    // Sets the Cinemachine toggle off so that you would no longer be able to move around
    // the graph view canvas
    public void ToggleCameraFollower()
    {
        cameraFollow.SetActive(!cameraFollow.activeInHierarchy);
        if(cameraFollow.activeInHierarchy == false)
        {
             GameObject.Find("Main Camera").transform.position = mainCameraOriginPos;
        }
    }
}
