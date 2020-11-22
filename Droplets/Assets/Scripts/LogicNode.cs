using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEditor;

public class LogicNode : DataObject
{
    // Start is called before the first frame update
    DataObject l_Input1;
    DataObject l_Input2;
    string l_Operation;
    bool l_result;

    public LogicNode(string name, string op, DataObject i1, DataObject i2, Vector2 position)
    : base (name, position)
    {
        l_Input1 = i1;
        l_Input2 = i2;
        l_Operation = op;
    }



    public override void OnGUI(){
        Rect drawRect = new Rect (m_Position.x, m_Position.y, width, height), dragRect;

		GUILayout.BeginArea (drawRect, GUI.skin.GetStyle ("Box"));
			GUILayout.Label (d_Name, GUI.skin.GetStyle ("Box"), GUILayout.ExpandWidth (true));
			dragRect = GUILayoutUtility.GetLastRect ();
			dragRect = new Rect (dragRect.x + m_Position.x, dragRect.y + m_Position.y, dragRect.width, dragRect.height);

			d_Name = EditorGUILayout.TextField(d_Name);
			l_Operation = EditorGUILayout.TextField(l_Operation); // change this to dropdown box.

			if (Dragging)
			{
				GUILayout.Label ("Wooo...");
			}

			if (GUILayout.Button ("Debug")){
				Debug.Log("Name: "+ d_Name);
                // Debug.Log(string.Format("{0} {1} {2} "));
				Debug.Log("Input1 Name: "+ l_Input1.d_Name);
				Debug.Log("Input2 Name: "+ l_Input2.d_Name);
				Debug.Log("Operation: "+ l_Operation);
                //Debug.Log("Res: " + (l_Input1.v_Value == l_Input2.v_Value));



			}
			else if (GUILayout.Button ("Delete"))
			{
				notDeleted = false;
				// TODO: Figure out how to remove from list witout breaking for each loop
				//VisualScriptingWindow.m_Data.Remove(this);
			}
		GUILayout.EndArea ();

		Drag (dragRect);
    }
}
