using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class ToolManager : MonoBehaviour {

    
    public const int numTools = 3;
    public Button[] tools = new Button[numTools];
    public SelectionManager selectionManager;

    // When the app is launched the tranlate tool should be active.
    private void Start()
    {
        // call select tool with a selected parameter of 0
        selectTool(0);
    }

    public void selectTool(int selected)
    {
        for (int i = 0; i < tools.Length; i++)
        {
            toggleButton toggle = tools[i].GetComponent<toggleButton>();
            // If we've reached the index of the tool the user wants to 
            // use, activate it if it is not already active.
            if (i == selected && toggle != null &&  !toggle.IsPressed)
            {
                toggle.changeState();
            }
            // Otherwise, deactivate the tool at this index.
            else if (toggle != null & toggle.IsPressed)
            {
                toggle.changeState();
            }
        }
        // If an object is selected, turn on the corresponding manipulator
        // NOTE: The best way I could think to do this was using a case structure,
        // as each manipulator is slightly different. If time allows it would be
        // worth revisiting this to try and find a more elegant implementation.
        if (selectionManager.Selected != null)
        {
            TranslateTool translate = selectionManager.Selected.GetComponent<TranslateTool>();
            RotateTool rotate = selectionManager.Selected.GetComponent<RotateTool>();
            ScaleTool scale = selectionManager.Selected.GetComponent<ScaleTool>();
            // TODO: Maybe look into adding error codes if any of these are found to be
            // null. It should never happen, but when do we ever *expect* an error to
            // happen?


            if (translate == null)
            {
                Debug.Log("Translate is null in selectTool().");
            }
            if (rotate == null)
            {
                Debug.Log("Rotate is null in selectTool().");
            }
            if (scale == null)
            {
                Debug.Log("Scale is null in selectTool().");
            }

            if (translate != null && rotate != null && scale != null)
            {
                Debug.Log("gets here");
                switch (selected)
                {
                    case 0:
                        translate.IsActive = true;
                        scale.IsActive = false;
                        rotate.IsActive = false;
                        break;
                    case 1:
                        translate.IsActive = false;
                        scale.IsActive = true;
                        rotate.IsActive = false;
                        break;
                    case 2:
                        translate.IsActive = false;
                        scale.IsActive = false;
                        rotate.IsActive = true;
                        break;
                }
            }
        }
    }
}
