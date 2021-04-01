using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

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

    public void ToggleCameraFollower()
    {
        cameraFollow.SetActive(!cameraFollow.activeInHierarchy);
        if(cameraFollow.activeInHierarchy == false)
        {
             GameObject.Find("Main Camera").transform.position = mainCameraOriginPos;
        }
    }
}
