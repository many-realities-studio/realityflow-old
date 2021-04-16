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

    // Update is called once per frame
    void Update()
    {
        if(Input.GetMouseButtonDown(0))
        {
            Vector2 mousePos;
            RectTransformUtility.ScreenPointToLocalPointInRectangle(parentCanvas, Input.mousePosition, cameraObject, out mousePos);
            
            //Debug.Log(mousePos);
            touchPlaceTrackerImage.anchoredPosition = mousePos;
        }
    }
}
