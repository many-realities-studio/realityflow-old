using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class ToggleCamera : MonoBehaviour
{
    public Camera main;
    public Camera top;
    public Camera angled;

    public void SwitchCam(int x)
    {
        //DeactivateAllCameras();

        if (x == 1)
        {
            top.enabled = false;
            top.GetComponent<AudioListener>().enabled = false;

            angled.enabled = false;
            angled.GetComponent<AudioListener>().enabled = false;

            main.enabled = true;
            main.GetComponent<AudioListener>().enabled = true;
        }
        else if (x == 2)
        {
            main.enabled = false;
            main.GetComponent<AudioListener>().enabled = false;

            angled.enabled = false;
            angled.GetComponent<AudioListener>().enabled = false;

            top.enabled = true;
            top.GetComponent<AudioListener>().enabled = true;
        }
        else
        {
            main.enabled = false;
            main.GetComponent<AudioListener>().enabled = false;

            top.enabled = false;
            top.GetComponent<AudioListener>().enabled = false;

            angled.enabled = true;
            angled.GetComponent<AudioListener>().enabled = true;
        }
    }

    public void DeactivateAllCameras()
    {
        main.enabled = false;
        main.GetComponent<AudioListener>().enabled = false;

        top.enabled = false;
        top.GetComponent<AudioListener>().enabled = false;

        angled.enabled = false;
        angled.GetComponent<AudioListener>().enabled = false;
    }
}
