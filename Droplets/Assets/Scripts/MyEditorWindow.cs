// using UnityEngine;
// using UnityEditor;
// using System.Collections;
// using System.Collections.Generic;

// public class MyEditorWindow : EditorWindow
// {
// 	private List< DataObject > m_Data = new List< DataObject > ();
// 	private List< Relation > relations = new List<Relation>();
// 	private bool doRepaint = false;
// 	private Rect dropTargetRect = new Rect (10.0f, 10.0f, 30.0f, 30.0f);

// 	public MyEditorWindow ()
// 	{
		
// 	}

// 	private void OnEnable() {
// 		DataObject node1 = new DataObject ("One","bool", 1, new Vector2 (20.0f * 4.0f, 20.0f * 4.0f));
// 		DataObject node2 = new DataObject ("Two","bool", 2, new Vector2 (20.0f * 16.0f, 20.0f * 5.0f));
// 		m_Data.Add (node1);
// 		m_Data.Add (node2);
// 		relations.Add( new Relation (node1, node2));
	
// 	}

// 	[MenuItem ("Window/Visual Scripting Demo")]
// 	public static void Launch ()
// 	{
// 		GetWindow (typeof (MyEditorWindow)).Show ();
// 	}

// 	public void Update ()
// 	{
// 		if (doRepaint)
// 		{
// 			Repaint ();
// 		}
// 	}

// 	public void OnGUI ()
// 	{
// 		DataObject toFront, dropDead;
// 		bool previousState, flipRepaint;
// 		Color color;

// 		GUI.Box(dropTargetRect, "Die");

// 		toFront = dropDead = null;
// 		doRepaint = false;
// 		flipRepaint = false;
// 		foreach (DataObject data in m_Data)
// 		{
// 			previousState = data.Dragging;

// 			color = GUI.color;

// 			if (previousState)
// 			{
// 				GUI.color = dropTargetRect.Contains (Event.current.mousePosition) ? Color.red : color;
// 			}

// 			data.OnGUI ();

// 			GUI.color = color;

// 			if (data.Dragging)
// 			{
// 				doRepaint = true;

// 				if (m_Data.IndexOf (data) != m_Data.Count - 1)
// 				{
// 					toFront = data;
// 				}
// 			}
// 			else if (previousState)
// 			{
// 				flipRepaint = true;

// 				if (dropTargetRect.Contains (Event.current.mousePosition))
// 				{
// 					dropDead = data;
// 				}
// 			}
// 		}

// 		foreach (Relation rel in relations){
// 			Debug.Log(rel);
// 			rel.OnGUI();
// 		}


// 		if (toFront != null)
// 		// Move an object to front if needed
// 		{
// 			m_Data.Remove (toFront);
// 			m_Data.Add (toFront);
// 		}

// 		if (dropDead != null)
// 		// Destroy an object if needed
// 		{
// 			m_Data.Remove (dropDead);
// 		}

// 		if (flipRepaint)
// 		// If some object just stopped being dragged, we should repaing for the state change
// 		{
// 			Repaint ();
// 		}
// 	}
// }