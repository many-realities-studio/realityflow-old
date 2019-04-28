using UnityEngine;

// This script contains functions needed to move the app's main camera.

public class CameraManager : MonoBehaviour
{
    private const int MOVE_INCREMENT = 10;
    private const int UP = 0;
    private const int RIGHT = 1;
    private const int DOWN = 2;
    private const int LEFT = 3;
    private const int IN = 0;
    private const int OUT = 1;
    private const float MIN_FOV = 1f;
    private const float MAX_FOV = 1000f;
    private const float ZOOM_FACTOR = 10f;

    // Nudges the camera by some proportion of MOVE_INCREMENT relative to the camera's current size.
    // The direction the camera is nudged is determined by the argument "dir".
    public void moveCamera(int dir)
    {
        Camera c = GetComponent<Camera>();
        float orthoSize = c.orthographicSize;

        switch (dir)
        {
            case (UP):
                transform.position = new Vector3(transform.position.x, transform.position.y + orthoSize / MOVE_INCREMENT, transform.position.z);
                break;
            case (RIGHT):
                transform.position = new Vector3(transform.position.x + orthoSize / MOVE_INCREMENT, transform.position.y, transform.position.z);
                break;
            case (DOWN):
                transform.position = new Vector3(transform.position.x, transform.position.y - orthoSize / MOVE_INCREMENT, transform.position.z);
                break;
            case (LEFT):
                transform.position = new Vector3(transform.position.x - orthoSize / MOVE_INCREMENT, transform.position.y, transform.position.z);
                break;
        }
    }

    // Zooms the camera by some proportion of ZOOM_FACTOR relative to the camera's current size.
    // The direction the camera is zoomed is determined by the argument "dir".
    public void zoom(int dir)
    {
        Camera c = GetComponent<Camera>();
        float orthoSize = c.orthographicSize;

        switch (dir)
        {
            case (IN):
                orthoSize -= orthoSize / ZOOM_FACTOR;
                orthoSize = Mathf.Clamp(orthoSize, MIN_FOV, MAX_FOV);
                c.orthographicSize = orthoSize;
                break;
            case (OUT):
                orthoSize += orthoSize / ZOOM_FACTOR;
                orthoSize = Mathf.Clamp(orthoSize, MIN_FOV, MAX_FOV);
                c.orthographicSize = orthoSize;
                break;
        }
    }
}