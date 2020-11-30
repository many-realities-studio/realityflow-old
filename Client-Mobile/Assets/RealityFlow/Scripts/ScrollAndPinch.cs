using UnityEngine;
using UnityEngine.EventSystems;

/// <summary>
/// Set this on an empty game object positioned at (0,0,0) and attach your active camera.
// The script only runs on mobile devices or the remote app.
// Source: https://www.youtube.com/watch?v=KkYco_7-ULA&t=260s
/// </summary>
class ScrollAndPinch : MonoBehaviour
{
    public Camera Camera;
    public bool Rotate;
    protected Plane Plane;
    private Vector3 camPosition;

    private void Awake()
    {
        if (Camera == null)
        {
            Camera = Camera.main;
        }

        // Save camera's initial position
        camPosition = Camera.transform.position;
            
    }

    private void Update()
    {

        // Update Plane
        if (Input.touchCount >= 2)
        {
            Plane.SetNormalAndPosition(transform.up, transform.position);
        }

        var Delta1 = Vector3.zero;
        var Delta2 = Vector3.zero;

        // 2-finger scroll detected, change the number to change what types of touches trigger a scroll
        if (Input.touchCount >= 2)
        {
            Delta1 = PlanePositionDelta(Input.GetTouch(0));
            if (Input.GetTouch(0).phase == TouchPhase.Moved)
                Camera.transform.Translate(Delta1, Space.World);
        }

        // 2-finger pinch detected
        if (Input.touchCount >= 2)
        {
            var pos1 = PlanePosition(Input.GetTouch(0).position);
            var pos2 = PlanePosition(Input.GetTouch(1).position);
            var pos1b = PlanePosition(Input.GetTouch(0).position - Input.GetTouch(0).deltaPosition);
            var pos2b = PlanePosition(Input.GetTouch(1).position - Input.GetTouch(1).deltaPosition);

            // Calculate zoom
            var zoom = Vector3.Distance(pos1, pos2) /
                       Vector3.Distance(pos1b, pos2b);

            // Edge case
            if (zoom == 0 || zoom > 10)
                return;

            // Move camera amount the mid ray
            Vector3 lerp = Vector3.LerpUnclamped(pos1, Camera.transform.position, 1 / zoom);

            // Camera is outside of clipping plane
            if (float.IsNaN(lerp.x))
            {
                Camera.transform.position = camPosition;
            }
            else
            {
                Camera.transform.position = lerp;
            }
                
            if (Rotate && pos2b != pos2)
            {
                Camera.transform.RotateAround(pos1, Plane.normal, Vector3.SignedAngle(pos2 - pos1, pos2b - pos1b, Plane.normal));
            }
        }
    }

    protected Vector3 PlanePositionDelta(Touch touch)
    {
        // Not moved
        if (touch.phase != TouchPhase.Moved)
        {
            return Vector3.zero;
        }
            

        // Delta
        var rayBefore = Camera.ScreenPointToRay(touch.position - touch.deltaPosition);
        var rayNow = Camera.ScreenPointToRay(touch.position);
        if (Plane.Raycast(rayBefore, out var enterBefore) && Plane.Raycast(rayNow, out var enterNow))
        {
            return rayBefore.GetPoint(enterBefore) - rayNow.GetPoint(enterNow);
        }
            
        // Not on plane
        return Vector3.zero;
    }

    protected Vector3 PlanePosition(Vector2 screenPos)
    {
        // Position
        var rayNow = Camera.ScreenPointToRay(screenPos);
        if (Plane.Raycast(rayNow, out var enterNow))
        {
            return rayNow.GetPoint(enterNow);
        }
            
        return Vector3.zero;
    }

    private void OnDrawGizmosSelected()
    {
        Gizmos.DrawLine(transform.position, transform.position + transform.up);
    }
}
