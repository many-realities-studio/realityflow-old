using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using RuntimeGizmos;

// This script contains functions necessary 

public class ColorManager : MonoBehaviour {

    public ColorPicker picker;
    public TransformGizmo gizmo;

    private void Start()
    {
        gizmo = GameObject.FindGameObjectWithTag("MainCamera").GetComponent<TransformGizmo>();
        if(picker == null)
            picker = GameObject.FindGameObjectWithTag("Picker").GetComponent<ColorPicker>();
        picker.onValueChanged.AddListener(color =>
        {
            foreach (Transform o in gizmo.targetRootsOrdered)
            {
                Renderer renderer = o.gameObject.GetComponent<Renderer>();
                if (renderer != null)
                {
                    renderer.material.color = color;
                }
            }
        });
    }
}
