using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using UnityEngine.EventSystems;

public class DragPanel : MonoBehaviour,  IPointerDownHandler, IDragHandler {

    private Vector2 pointerOffSet;
    private RectTransform canvasRectTransform;
    private RectTransform panelRectTransform;

    // Initialize canvas and panel class variables
    void Awake()
    {
        Canvas canvas = GetComponentInParent<Canvas>();
        if (canvas != null)
        {
            canvasRectTransform = canvas.transform as RectTransform;
            panelRectTransform = transform.parent as RectTransform;
        }
    }

    public void OnPointerDown(PointerEventData data)
    {
        panelRectTransform.SetAsLastSibling();
        RectTransformUtility.ScreenPointToLocalPointInRectangle(
            panelRectTransform,
            data.position,
            data.pressEventCamera,
            out pointerOffSet);
    }

    public void OnDrag(PointerEventData data)
    {
        if (panelRectTransform == null)
        {
            return;
        }

        // "Clamp" code: limits the position of the cursor to the bounds of the window
        // when dragging the panel. 
        //
        // TODO: replace this with code for preventing the top and bottom of the panel
        // from being dragged off screen, and the left and right sides from going
        // outside a given bounds. Might pass these bounds as parameters.
        // I could also write code that prevents the top and bottom of the parent from
        // going outside the screen space, and the DragZone from going off the screen.
        Vector2 pointerPosition = ClampToWindow(data);

        Vector2 localPointerPointerPosition;
        if (RectTransformUtility.ScreenPointToLocalPointInRectangle(
            canvasRectTransform, 
            pointerPosition, 
            data.pressEventCamera, 
            out localPointerPointerPosition))
        {
            panelRectTransform.localPosition = localPointerPointerPosition - pointerOffSet;
        }
    }

    Vector2 ClampToWindow(PointerEventData data)
    {
        Vector2 rawPointerPosition = data.position;
        // 4 here is not a magic number, as the canvas should always have 4 corners.
        Vector3[] canvasCorners = new Vector3[4];
        canvasRectTransform.GetWorldCorners(canvasCorners);

        // Get positions of canvas corners and store them in a 2D vector
        float clampX = Mathf.Clamp(rawPointerPosition.x, canvasCorners[0].x, canvasCorners[2].x);
        float clampY = Mathf.Clamp(rawPointerPosition.y, canvasCorners[0].y, canvasCorners[2].y);
        Vector2 newPointerPosition = new Vector2(clampX, clampY);

        return newPointerPosition;
    }
}
