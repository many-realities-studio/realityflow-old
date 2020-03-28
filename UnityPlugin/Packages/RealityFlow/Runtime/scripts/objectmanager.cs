using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEditor;

namespace RealityFlow.Plugin.Scripts
{
	// [ExecuteInEditMode]
	public class ObjectManager : MonoBehaviour
	{

		List<GameObject> children;
		Transform[] ts;

		// Update is called once per frame
		void Update()
		{

		}

		public List<GameObject> GetFlowObjects()
		{
			children = new List<GameObject>();
			ts = gameObject.GetComponentsInChildren<Transform>();

			foreach (Transform child in ts)
			{
				if (child != ts[0])
				{
					children.Add(child.gameObject);
				}
			}

			return children;
		}
	}
}
