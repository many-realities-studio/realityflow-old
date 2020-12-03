  using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class PlayerInput : MonoBehaviour
{
    CameraHandler cameraHand;
    public FixedJoystick movement;
    public FixedJoystick rotMovement;

    Vector3 moveInput;
    Vector3 rotInput;

    bool powered = true;

    // Start is called before the first frame update
    void Start()
    {
        cameraHand = GetComponent<CameraHandler>();
    }

    // Update is called once per frame
    void Update()
    {
        // Recieve input in update;
        float horizontal = movement.Horizontal; //Input.GetAxisRaw("Horizontal");
        float vertical = movement.Vertical; //Input.GetAxisRaw("Vertical");
        float up = Input.GetAxisRaw("ZAxis");

        float rotHorizontal = rotMovement.Horizontal;
        float rotVertical = -rotMovement.Vertical;
        float rotUp = Input.GetAxisRaw("Mouse ZAxis");

        moveInput = new Vector3(horizontal, up, vertical);
        rotInput = new Vector3(rotVertical, rotHorizontal, rotUp);

        if (Input.GetKeyDown(KeyCode.P))
        {
            powered = !powered;
        }
        
    }

    void FixedUpdate()
    {
        // Send input;
        cameraHand.MoveInput(moveInput, rotInput, powered);
    }
}
