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
		//GameObject WhiteBoard2 = Instantiate(Canvas, Canvas.transform.position, Canvas.transform.rotation);
		//WhiteBoard2.transform.parent = GameObject.FindGameObjectsWithTag("Player")[0].transform;
		// find the graph from the canvas gameobject
		GameObject rfgvGameObject = GameObject.FindGameObjectWithTag("Canvas").transform.GetChild(5).gameObject; // = ___
		RealityFlowGraphView rfgv = rfgvGameObject.GetComponent<RealityFlowGraphView>();
		BaseGraph graph = rfgv.graph;
		NodeUI.instance.Setup(graph);
		
	}
}
