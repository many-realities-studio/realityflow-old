using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEditor;

public class Relation
{

	public DataObject start;
    public DataObject end;
	public float lineThickness = 2.0f;

    public Relation (DataObject node1, DataObject node2)
	{
		start = node1;
		end = node2;
	}

	public string toString(){
		return start.toString() + " to " + end.toString();
	}

	private void DrawRelationLine(){
		float horzLineLength = (end.m_Position.x - start.m_Position.x - start.width)/2;
		float vertLineLength = (end.m_Position.y - start.m_Position.y);

		float padding = start.width / 2.0f;

		// horz line FROM node1
		EditorGUI.DrawRect(new Rect(start.m_Position.x+(start.width-lineThickness), start.m_Position.y+padding, horzLineLength+lineThickness, lineThickness), Color.yellow);

		// horz line TO node2
		EditorGUI.DrawRect(new Rect(end.m_Position.x-horzLineLength-lineThickness, end.m_Position.y+padding, horzLineLength+(lineThickness*2.0f), lineThickness), Color.yellow);

		// vertical line;
		EditorGUI.DrawRect(new Rect(start.m_Position.x+horzLineLength+start.width-lineThickness, start.m_Position.y+(start.width/2), lineThickness, vertLineLength), Color.yellow);
	}

	public void OnGUI(){
		DrawRelationLine();
	}



}
