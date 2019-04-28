using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class toggleSceneOptions : MonoBehaviour {

    public GameObject SceneSelectionOptions;
    public GameObject otherToggle;

    public void openOptions()
    {
        SceneSelectionOptions.SetActive(!SceneSelectionOptions.activeSelf);
        this.gameObject.SetActive(!this.gameObject.activeSelf);
        otherToggle.SetActive(!otherToggle.activeSelf);

        /*
        if (SceneSelectionOptions != null)
        {
            bool isActive = SceneSelectionOptions.activeSelf;
            if(isActive)
                this.transform.position += Vector3.right * -150;
            else
                this.transform.position += Vector3.right * 150;
            SceneSelectionOptions.SetActive(!isActive);
        }
        */
    }
}
