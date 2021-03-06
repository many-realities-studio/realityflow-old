using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using GraphProcessor;
using NodeGraphProcessor.Examples;

public class ButtonClick : MonoBehaviour
{
	public GameObject Canvas;
	public void CreateCanvas()
	{
		GameObject WhiteBoard = Instantiate(Canvas, Canvas.transform.position, Canvas.transform.rotation);
		WhiteBoard.transform.parent = GameObject.FindGameObjectsWithTag("Player")[0].transform;
		Debug.Log("Canvas should have been created");
	}
}
