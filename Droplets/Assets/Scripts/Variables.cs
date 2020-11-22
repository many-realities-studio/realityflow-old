using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEditor;

public class Variables : DataObject
{
    // public string m_Name;
	public string v_Type;
	public float v_Value;

    public Variables (string name, string type, float value, Vector2 position) : base (name, position)
	{
		// m_Name = name;
		v_Value = value;
		v_Type = type;
	}

	
    public void drawNode()
	{
		Rect drawRect = new Rect (m_Position.x, m_Position.y, width, height), dragRect;

		GUILayout.BeginArea (drawRect, GUI.skin.GetStyle ("Box"));
			GUILayout.Label (d_Name, GUI.skin.GetStyle ("Box"), GUILayout.ExpandWidth (true));
			dragRect = GUILayoutUtility.GetLastRect ();
			dragRect = new Rect (dragRect.x + m_Position.x, dragRect.y + m_Position.y, dragRect.width, dragRect.height);

			d_Name = EditorGUILayout.TextField(d_Name);

			switch (v_Type){
				// case "bool":
				// 	bool v = Mathf.Approximately(Mathf.Min(v_Value, 1), 1);
				// 	v_Value = EditorGUILayout.Toggle(v);
				// 	break;

				default:
					v_Value = EditorGUILayout.FloatField(v_Value);
					break;
			}
			// v_Type = EditorGUILayout.TextField(v_Type);	

			if (Dragging)
			{
				GUILayout.Label ("Wooo...");
			}

			if (GUILayout.Button ("Debug")){
				Debug.Log("Name: "+ d_Name);
				Debug.Log("Type: "+ v_Type);
				Debug.Log("Value: "+ v_Value);

			}
			else if (GUILayout.Button ("Delete"))
			{
				Debug.Log ("Yes. It is " + v_Value + "!");
				notDeleted = false;
				// TODO: Figure out how to remove from list witout breaking for each loop
				//VisualScriptingWindow.m_Data.Remove(this);
			}
		GUILayout.EndArea ();

		Drag (dragRect);
	}
	public override void OnGUI ()
	{
		if(notDeleted)
		{
			drawNode();
		}
	}
}
