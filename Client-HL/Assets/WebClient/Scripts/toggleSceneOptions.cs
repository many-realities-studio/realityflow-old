using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class toggleSceneOptions : MonoBehaviour {

    public GameObject SceneSelectionOptions;
    public GameObject otherButton;

    public void toggleOptions()
    {
        gameObject.SetActive(false);
        otherButton.SetActive(true);
        SceneSelectionOptions.SetActive(!SceneSelectionOptions.activeSelf);
    }
}
