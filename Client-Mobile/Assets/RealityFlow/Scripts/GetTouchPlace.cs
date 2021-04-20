using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class GetTouchPlace : MonoBehaviour
{
    public GameObject touchPlaceTracker;
    public RectTransform touchPlaceTrackerImage;
    public RectTransform parentCanvas;
    public Camera cameraObject;

    // Start is called before the first frame update
    void Start()
    {
        
    }

    // Used to move the cinemachine around by translating where ever you touch to the local position in the canvas
    // and then sets the gameobject to that position so that the cinemachine can follow to that location.
    void Update()
    {
        if(Input.GetMouseButtonDown(0))
        {
            Vector2 mousePos;
            RectTransformUtility.ScreenPointToLocalPointInRectangle(parentCanvas, Input.mousePosition, cameraObject, out mousePos);
            
            touchPlaceTrackerImage.anchoredPosition = mousePos;
        }
    }
}
