using System;
using System.Collections.Generic;
using System.Runtime.Serialization;
using UnityEngine;

namespace RealityFlow.Plugin.Scripts
{
    [DataContract]
    public class FlowProject : FlowValue
    {
        [DataMember]
        public string FlowId { get; set; }
        [DataMember]
        public string Id { get; set; }
        [DataMember]
        public string Description { get; set; }
        [DataMember]
        public int DateModified { get; set; }
        [DataMember]
        public string ProjectName { get; set; }
        [DataMember]
        public FlowTObject[] _ObjectList { get; set; }

        //public int _uid;
        //public string description;
        //public int created;
        //public int dateModified;
        //public string projectName;
        //public List<FlowTObject> transforms;
        //[System.NonSerialized]
        //public Dictionary<string, FlowTObject> transformsById;
        //[System.NonSerialized]
        //public List<int> collaborators;
        //public List<int> activeConnections;
        //public bool initialized = false;
        ////public List<ProjectCommand> history;

        //[System.NonSerialized]
        //public List<GameObject> objs = new List<GameObject>();

        //[System.NonSerialized]
        //public static FlowProject activeProject;

        //public FlowProject(string id)
        //{
        //    _id = id;
        //}

        //public FlowProject()
        //{

        //}

        //public void initialize()
        //{
        //    activeProject = this;
        //    if (!initialized)
        //    {
        //        initialized = true;
        //        transformsById = new Dictionary<string, FlowTObject>();
        //        if (transforms == null)
        //            transforms = new List<FlowTObject>();
        //        for (int g = 0; g < transforms.Count; g++)
        //        {
        //            transformsById.Add(transforms[g]._id, transforms[g]);
        //        }
        //    }
        //    //FlowObject.registerObject();
        //}

        //public void RegObj()
        //{
        //    FlowObject.registerObject();
        //}
    }
}
