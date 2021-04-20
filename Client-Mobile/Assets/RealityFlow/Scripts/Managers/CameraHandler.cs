using System.Collections;
using System.Collections.Generic;
using UnityEngine;

// This class handles the movement around the scene in the mobile app
// It is needed fpr 6DOF
public class CameraHandler : MonoBehaviour
{
    Vector3 posInput;
    Vector3 rotInput;

    bool powered = true;

    public void MoveInput(Vector3 move, Vector3 rote, bool power)
    {
        posInput = move;
        rotInput = rote;
        powered = power;

        ActuallyMove();

    }

    // Preform the actual movement of the camera by entering new positional information
    void ActuallyMove()
    {
        if(powered)
        {
            transform.Translate(posInput);
            transform.Rotate(rotInput);
        }
    }
}
