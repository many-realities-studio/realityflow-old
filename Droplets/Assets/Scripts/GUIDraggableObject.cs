using UnityEngine;
using System.Collections;

public class GUIDraggableObject
{
	public Vector2 m_Position;
	private Vector2 m_DragStart;
	private bool m_Dragging;

	public GUIDraggableObject (Vector2 position)
	{
		m_Position = position;
	}

	public bool Dragging
	{
		get
		{
			return m_Dragging;
		}
	}

	public Vector2 Position
	{
		get
		{
			return m_Position;
		}

		set
		{
			m_Position = value;
		}
	}

	public void Drag (Rect draggingRect)
	{
		if (Event.current.type == EventType.MouseUp)
		{
			m_Dragging = false;
		}
		else if (Event.current.type == EventType.MouseDown && draggingRect.Contains (Event.current.mousePosition))
		{
			m_Dragging = true;
			m_DragStart = Event.current.mousePosition - m_Position;
			Event.current.Use();
		}

		if (m_Dragging)
		{
			m_Position = Event.current.mousePosition - m_DragStart;
		}
	}
}