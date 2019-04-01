using System.Collections;
using System.Collections.Generic;
using UnityEngine;

[System.Serializable]
public class FlowProjectRequest : FlowValue
{
    public FlowProject project;
    public FlowUser user;
    public FlowClient client;

    public FlowProjectRequest(string projectName, string userId, string deviceId)

    {
        project = new FlowProject(projectName);
        user = new FlowUser(userId);
        client = new FlowClient(deviceId);
    }
}