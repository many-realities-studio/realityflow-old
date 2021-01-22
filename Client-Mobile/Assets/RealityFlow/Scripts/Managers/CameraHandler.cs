using System.Collections;
using System.Collections.Generic;
using UnityEngine;

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

    void ActuallyMove()
    {
        if(powered)
        {
            transform.Translate(posInput);
            transform.Rotate(rotInput);
        }
    }
}
