using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class ToolManager : MonoBehaviour
{

    public Camera mainCamera;
    public const int numTools = 3;
    public Button[] toolButtons = new Button[numTools];
    private RuntimeGizmos.TransformGizmo transformGizmo;

    // When the app is launched the translate tool should be active.
    private void Awake()
    {
        // call select tool with a selected parameter of 0
        selectTool(0);
        transformGizmo = mainCamera.GetComponent<RuntimeGizmos.TransformGizmo>();
    }

    public void selectTool(int selected)
    {
        RuntimeGizmos.TransformGizmo transformGizmo = mainCamera.GetComponent<RuntimeGizmos.TransformGizmo>();
        for (int i = 0; i < toolButtons.Length; i++)
        {
            toggleButton toggle = toolButtons[i].GetComponent<toggleButton>();
            // If we've reached the index of the tool the user wants to use, activate it if it is not already active.
            if (i == selected && toggle != null && !toggle.IsPressed)
            {
                toggle.changeState();
                transformGizmo.transformType = getTransformType(i, transformGizmo.transformType);
            }
            // Otherwise, deactivate the tool at this index.
            else if (toggle != null & toggle.IsPressed)
            {
                toggle.changeState();
            }
        }
    }

    private RuntimeGizmos.TransformType getTransformType(int i, RuntimeGizmos.TransformType current)
    {
        switch (i)
        {
            case 0:
                return RuntimeGizmos.TransformType.Move;
            case 1:
                return RuntimeGizmos.TransformType.Scale;
            case 2:
                return RuntimeGizmos.TransformType.Rotate;
        }

        return current;
    }
}
