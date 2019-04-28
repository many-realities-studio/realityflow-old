using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using RuntimeGizmos;

public class ApplyColor : MonoBehaviour {

    // constants
    private const string PICKER = "Picker";
    private const string CAMERA = "MainCamera";

    Renderer objRenderer;
    ColorPicker picker;
    TransformGizmo gizmo;

	void Start () {
        objRenderer = gameObject.GetComponent<Renderer>();
        picker = GameObject.FindGameObjectWithTag(PICKER).GetComponent<ColorPicker>();
        gizmo = GameObject.FindGameObjectWithTag(CAMERA).GetComponent<TransformGizmo>();

        // Event listener for color value change in color picker
        picker.onValueChanged.AddListener(color =>
        {
            // only apply color to selected objects
            if (gizmo.isSelected(gameObject.transform))
                objRenderer.material.color = color;
        });
	}
}
