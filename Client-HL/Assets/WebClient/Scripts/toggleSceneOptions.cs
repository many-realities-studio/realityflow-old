using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class toggleSceneOptions : MonoBehaviour {

    public GameObject SceneSelectionOptions;

    public void openOptions()
    {
        if (SceneSelectionOptions != null)
        {
            bool isActive = SceneSelectionOptions.activeSelf;
            if(isActive)
                this.transform.position += Vector3.right * -150;
            else
                this.transform.position += Vector3.right * 150;
            SceneSelectionOptions.SetActive(!isActive);
        }
    }
}
