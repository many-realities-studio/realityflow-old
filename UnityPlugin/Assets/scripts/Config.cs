using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public static class Config {

	public static bool LOCAL_HOST = true;
	public static int CHANGE_TYPE = 0;
    public static int DEVICE_TYPE = -1;

	public static string userId = "-9999";
	public static string projectId = "-9999";
	public static string deviceId = "-9999";
	//public static Dictionary<string, string> projectList; 
	public static List<FlowProject> projectList = null;
    public static List<FlowTObject> objs;

}
