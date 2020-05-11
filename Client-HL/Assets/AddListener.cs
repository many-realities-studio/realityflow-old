using Microsoft.MixedReality.Toolkit.UI;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class AddListener : MonoBehaviour
{

    public void AddDetermineCheckedOut()
    {
        GetComponent<ManipulationHandler>().OnManipulationStarted.AddListener(FindObjectOfType<NetworkManagerHL>().DetermineCheckedOut);
    }
}
