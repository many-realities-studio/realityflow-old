using UnityEngine;
using UnityEditor;
using System.Collections;

public class DataObject : GUIDraggableObject
// This class just has the capability of being dragged in GUI - it could be any type of generic data class
{
	public string d_Name;  // this can be both var & logic
	// public string m_Type;  // send to variable node
	// private int m_Value;  // send over to variablenode
	public float width = 150.0f;
	public float height = 150.0f;
	public bool notDeleted = true;

/* 	public DataObject (string name, string type, int value, Vector2 position) : base (position)
	{
		m_Name = name;
		m_Value = value;
		m_Type = type;
	} */

	public DataObject (string name, Vector2 position) : base (position)
	{
		d_Name = name;
	}

	public virtual void OnGUI(){
		Rect drawRect = new Rect (m_Position.x, m_Position.y, width, height), dragRect;
		GUILayout.BeginArea (drawRect, GUI.skin.GetStyle ("Box"));
			GUILayout.Label (d_Name, GUI.skin.GetStyle ("Box"), GUILayout.ExpandWidth (true));
			dragRect = GUILayoutUtility.GetLastRect ();
			dragRect = new Rect (dragRect.x + m_Position.x, dragRect.y + m_Position.y, dragRect.width, dragRect.height);

			if (GUILayout.Button ("Debug")){
				Debug.Log("Name: "+ d_Name);
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
	
	public string toString(){
		return d_Name;
	}
}