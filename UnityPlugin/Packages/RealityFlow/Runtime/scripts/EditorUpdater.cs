using System.Collections;
using System.Collections.Generic;
using UnityEngine;

namespace RealityFlow.Plugin.Scripts
{

	// [ExecuteInEditMode]
	public class EditorUpdater : MonoBehaviour
	{
		// Update is called once per frame
		public void Update()
		{
			if (Config.CHANGE_TYPE == 0)
			{
				gameObject.transform.localPosition += new Vector3(1, 0, 0);
				Config.CHANGE_TYPE++;
			}
			else
			{
				gameObject.transform.localPosition -= new Vector3(1, 0, 0);
				Config.CHANGE_TYPE--;
			}
		}
	}
}
