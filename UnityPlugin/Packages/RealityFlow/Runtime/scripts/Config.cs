using System.Collections;
using System.Collections.Generic;
using UnityEngine;

namespace RealityFlow.Plugin.Scripts
{
	public static class Config
	{

		public static bool LOCAL_HOST = true;
		public static int CHANGE_TYPE = 0;
		public static int DEVICE_TYPE = -1;

		public static string userId = "-9999";
		public static string projectId = "-9999";
		public static string deviceId = "-9999";
		//public static Dictionary<string, string> projectList; 
		public static List<FlowProject> projectList = null;
		public static List<FlowTObject> objs;

		public static void ResetValues()
		{
			LOCAL_HOST = true;
			CHANGE_TYPE = 0;
			DEVICE_TYPE = -1;

			userId = "-9999";
			projectId = "-9999";
			deviceId = "-9999";
			projectList = null;

			if (objs != null)
				objs.Clear();
		}

	}
}
