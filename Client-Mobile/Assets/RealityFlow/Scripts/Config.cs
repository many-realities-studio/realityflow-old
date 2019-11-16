using System.Collections;
using System.Collections.Generic;
using UnityEngine;

// This class is used to store data associated with the current user or
// project. Store information here that needs to be maintained between
// scene loads.

public static class Config {

	public static bool LOCAL_HOST = true;
	public static int CHANGE_TYPE = 0;

	public static string userId = "-9999";
    public static string username = "";
	public static string projectId = "-9999";
	public static string deviceId = "-9999";
    public static int deviceType = -1;
	public static List<FlowProject> projectList = null;
    public static List<FlowTObject> objs;

    public static void ResetConfig()
    {
        userId = "-9999";
        username = "";
        projectList = null;
    }
}
