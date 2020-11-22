using UnityEngine;
using UnityEditor;
using System.Collections;
using System.Collections.Generic;

public class VisualScriptingWindow : EditorWindow
{
	public static List< DataObject > m_Data = new List< DataObject > ();
	private List< Relation > relations = new List<Relation>();
	public static List<Variables> vars = new List<Variables>();
	public static List<string> varNames = new List<string>();
	private bool doRepaint = false;
	private Rect dropTargetRect = new Rect (10.0f, 10.0f, 30.0f, 30.0f);

	static Variables var1;
	static Variables var2;
	static string op;

	public VisualScriptingWindow ()
	{
		
	}

	public static void sendVars(Variables vars1,Variables vars2, string ops)
	{
		var1 = vars1;
		var2 = vars2;
		op = ops;
		Debug.Log("in sendvars var1 is "+var1.d_Name+" var2 is "+var2.d_Name+" op is "+op);
	}

	public static void addVar(Variables var)
	{
		vars.Add(var);
	}

	public static void addVarName(string v)
	{
		varNames.Add(v);
	}

	private void OnEnable() {
		Variables node1 = new Variables ("rel_a","bool", 1, new Vector2 (20.0f * 4.0f, 20.0f * 4.0f));
		Variables node2 = new Variables ("rel_b","bool", 0, new Vector2 (20.0f * 16.0f, 20.0f * 5.0f));
		m_Data.Add (node1);
		m_Data.Add (node2);
		relations.Add( new Relation (node1, node2));
	
	}

	[MenuItem ("Window/Visual Scripting Demo")]
	public static void Launch ()
	{
		GetWindow (typeof (VisualScriptingWindow)).Show ();
	}

	public void Update ()
	{
		if (doRepaint)
		{
			Repaint ();
		}
	}

	public void parseNode(Variables node)
	{
		if(node.v_Type=="IF")
		{
			// TODO: Make these variables accept anything from vars via dropdown
			// TODO: make op accept anything from a list of possible operations, via dropdown
			bool returnV = false;
			Debug.Log("var1 is "+var1.d_Name+" var2 is "+var2.d_Name+" op is "+op);
			node.d_Name = "if("+var1.d_Name+" "+op+" "+var2.d_Name+")";
			if(var1.v_Type != var2.v_Type)
			{
				node.d_Name = "TYPE ERROR: "+vars[0].v_Type+" conflicts with "+vars[1].v_Type;
			}

			switch (op)
			{
				case "==":
					returnV = (var1.v_Value == var2.v_Value);
					break;

				case "!=":
					returnV = (var1.v_Value != var2.v_Value);
					break;
				
				case ">":
					returnV = (var1.v_Value > var2.v_Value);
					break;
				case ">=":
					returnV = (var1.v_Value >= var2.v_Value);
					break;
				case "<":
					returnV = (var1.v_Value < var2.v_Value);
					break;
				case "<=":
					returnV = (var1.v_Value <= var2.v_Value);
					break;
			}

			Debug.Log("IF returns " + returnV);
		}
	}

	public void OnGUI ()
	{
		DataObject toFront, dropDead;
		bool previousState, flipRepaint;
		Color color;

		// Draw the toolbelt
		Rect tb = new Rect(10.0f, 10.0f, 200.0f, 1000.0f);
		GUILayout.BeginArea (tb, GUI.skin.GetStyle ("Box"));
			GUILayout.Label ("Toolbelt", GUI.skin.GetStyle ("Box"), GUILayout.ExpandWidth (true));

			string placeholderNodeName = "Hello";

			if (GUILayout.Button ("Create Logic Node"))
			{
				Debug.Log ("You have created a logic node");
				// DataObject tempNode = new DataObject ("logic_node"+(m_Data.Count+1), );
				LogicNode tempNode = new LogicNode("logic_node"+(m_Data.Count+1), "==", m_Data[0], m_Data[1], new Vector2 (20.0f * 10.0f, 20.0f * 10.0f));
				m_Data.Add(tempNode);
				// TODO: create the actual node
				// VariableSelectionWindow varWindow = new VariableSelectionWindow();
				// varWindow.ShowUtility();
				// if(var1 != null && var2 != null && op != null)
				// {
				// 	// DataObject newIfNode = new DataObject(placeholderNodeName,"IF",1, new Vector2 (20.0f * 4.0f, 20.0f * 4.0f));
				// 	// parseNode(newIfNode);
				// 	// m_Data.Add(newIfNode);
				// }
			}

			/* if (GUILayout.Button ("Create Variable"))
			{
				Debug.Log ("You have created a variable");
				// TODO: create the actual variable
				VariableWindow varWindow = new VariableWindow();
				varWindow.ShowUtility();
			} */

			if (GUILayout.Button( "Create Variable Node"))
			{
				Debug.Log("Created a variable node");
				Variables tempNode = new Variables ("var_node"+(m_Data.Count+1),"bool", 1, new Vector2 (20.0f * 10.0f, 20.0f * 10.0f));
				m_Data.Add(tempNode);

			}


		GUILayout.EndArea ();


		// GUI.Box(dropTargetRect, "Die");

		toFront = dropDead = null;
		doRepaint = false;
		flipRepaint = false;
		foreach (DataObject data in m_Data)
		{
			previousState = data.Dragging;

			color = GUI.color;

			if (previousState)
			{
				GUI.color = dropTargetRect.Contains (Event.current.mousePosition) ? Color.red : color;
			}

			data.OnGUI ();

			GUI.color = color;

			if (data.Dragging)
			{
				doRepaint = true;

				if (m_Data.IndexOf (data) != m_Data.Count - 1)
				{
					toFront = data;
				}
			}
			else if (previousState)
			{
				flipRepaint = true;

				if (dropTargetRect.Contains (Event.current.mousePosition))
				{
					dropDead = data;
				}
			}
		}


		// TODO: Draw relations now
		foreach (Relation rel in relations){
			// Debug.Log(rel);
			rel.OnGUI();
		}


		if (toFront != null)
		// Move an object to front if needed
		{
			m_Data.Remove (toFront);
			m_Data.Add (toFront);
		}

		if (dropDead != null)
		// Destroy an object if needed
		{
			m_Data.Remove (dropDead);
		}

		if (flipRepaint)
		// If some object just stopped being dragged, we should repaing for the state change
		{
			Repaint ();
		}
	}
}