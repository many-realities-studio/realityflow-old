using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class FadeObjectNotActive : MonoBehaviour {

    private void OnEnable()
    {

        NRSRManager.objectFocused += fadeObject;
        NRSRManager.objectUnFocused += unFadeObject;

    }

    private void OnDisable()
    {

        NRSRManager.objectFocused -= fadeObject;
        NRSRManager.objectUnFocused -= unFadeObject;

    }

    void fadeObject()
    {
        if (gameObject.tag == "Tool")
            return;


    }

    void unFadeObject()
    {
        if (gameObject.tag == "Tool")
            return;
    }
}
