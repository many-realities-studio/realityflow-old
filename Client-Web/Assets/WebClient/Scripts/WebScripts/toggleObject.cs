using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class toggleObject : MonoBehaviour
{
    public GameObject objToToggle;

    public void toggleTheObject()
    {
        objToToggle.SetActive(!objToToggle.activeSelf);
    }
}
