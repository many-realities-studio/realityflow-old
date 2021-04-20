  using System.Collections;
using System.Collections.Generic;
using UnityEngine;

// This file is attached to the camera as that is regarded as the player in the scene.
public class PlayerInput : MonoBehaviour
{
    CameraHandler cameraHand;
    
    [Header("List Canvas")]
    public GameObject listCanvas;
    public FixedJoystick listMovement;
    public FixedJoystick listRotMovement;

    [Header("Graph Canvas")]
    public GameObject graphCanvas;
    public FixedJoystick graphMovement;
    public FixedJoystick graphRotMovement;

    Vector3 moveInput;
    Vector3 rotInput;

    bool powered = true;

    // Start is called before the first frame update
    void Start()
    {
        cameraHand = GetComponent<CameraHandler>();
    }

    // It receives the joysticks information and creates a vector3 out of the
    // directional data.
    void Update()
    {
        if(listCanvas.activeInHierarchy)
        {
            // Recieve input in update;
            float horizontal = listMovement.Horizontal; //Input.GetAxisRaw("Horizontal");
            float vertical = listMovement.Vertical; //Input.GetAxisRaw("Vertical");
            float up = Input.GetAxisRaw("ZAxis");

            float rotHorizontal = listRotMovement.Horizontal;
            float rotVertical = -listRotMovement.Vertical;
            float rotUp = Input.GetAxisRaw("Mouse ZAxis");

            moveInput = new Vector3(horizontal, up, vertical);
            rotInput = new Vector3(rotVertical, rotHorizontal, rotUp);

            if (Input.GetKeyDown(KeyCode.P))
            {
                powered = !powered;
            }
        }

        else if(graphCanvas.activeInHierarchy)
        {
            // Recieve input in update;
            float horizontal = graphMovement.Horizontal; //Input.GetAxisRaw("Horizontal");
            float vertical = graphMovement.Vertical; //Input.GetAxisRaw("Vertical");
            float up = Input.GetAxisRaw("ZAxis");

            float rotHorizontal = graphRotMovement.Horizontal;
            float rotVertical = -graphRotMovement.Vertical;
            float rotUp = Input.GetAxisRaw("Mouse ZAxis");

            moveInput = new Vector3(horizontal, up, vertical);
            rotInput = new Vector3(rotVertical, rotHorizontal, rotUp);

            if (Input.GetKeyDown(KeyCode.P))
            {
                powered = !powered;
            }
        }
    }

    void FixedUpdate()
    {
        // Send input;
        cameraHand.MoveInput(moveInput, rotInput, powered);
    }
}
