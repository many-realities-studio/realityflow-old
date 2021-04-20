using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using RuntimeGizmos;

// This script contains functions necessary 

public class ColorManager : MonoBehaviour {

    public ColorPicker picker;
    public TransformGizmo gizmo;
    public SlideMenuManager slideMenu;

    // Sets the color of a object using the color picker. Right now it only works locally.
    private void Start()
    {
        slideMenu = (SlideMenuManager)FindObjectOfType(typeof(SlideMenuManager));
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
                    // To fix the update only being done locally you would need to edit the renderer of the object.
                    renderer.material.color = color;
                    slideMenu.UpdateObjectFromSlideMenu();
                }
            }
        });
    }
}
