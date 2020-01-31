using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class ToggleCamera : MonoBehaviour
{
    public Quaternion newRotation;
    public const int MAIN = 0;
    public const int TOP = 1;
    public const int ANGLED = 2;

    public void SwitchCam(int x)
    {

        switch (x)
        {
            case MAIN:
                transform.position = new Vector3(0f, 0f, -100f);
                newRotation = Quaternion.Euler(0, 0, 0);
                transform.rotation = newRotation;
                break;

            case TOP:
                transform.position = new Vector3(5f, 515f, -46f);
                newRotation = Quaternion.Euler(91.67899f, -.00001525879f, -.00001525879f);
                transform.rotation = newRotation;
                break;

            case ANGLED:
                transform.position = new Vector3(203f, 340f, -361f);
                newRotation = Quaternion.Euler(34.842f, -30.75f, 0.8470001f);
                transform.rotation = newRotation;
                break;

        }

    }

}
