using System;
using System.Collections.Generic;
using UnityEngine;

[System.Serializable]
public class FlowProject
{
    public int _uid;
    public String description;
    public int dateCreated;
    public int dateModified;
    public String name;
    public List<FlowTransform> transforms;
    [System.NonSerialized]
    public Dictionary<string, FlowTransform> transformsById;
    [System.NonSerialized]
    public List<int> collaborators;
    public List<int> activeConnections;
    public bool initialized = false;
    //public List<ProjectCommand> history;

    [System.NonSerialized]
    public List<GameObject> objs = new List<GameObject>();

    
    [System.NonSerialized]
    public static FlowProject activeProject;

    public void initialize()
    {
        activeProject = this;
        if (!initialized)
        {
            initialized = true;
            transformsById = new Dictionary<string, FlowTransform>();
            if(transforms == null)
                transforms = new List<FlowTransform>();
            for (int g = 0; g < transforms.Count; g++)
            {
                transformsById.Add(transforms[g]._id, transforms[g]);
            }
        }
        FlowObject.registerObject();
    }
}
