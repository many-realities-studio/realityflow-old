using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UnityEngine;

namespace Assets.RealityFlow.Scripts.Events
{
    [System.Serializable]
    public class ProjectFetchEvent : FlowEvent
    {
        public static int scmd = Commands.Project.OPEN;

        public FlowProject project;
        public List<FlowTObject> objs;

        public ProjectFetchEvent()
        {
            command = scmd;
        }

        public void Send()
        {
            project = new FlowProject(Config.projectId);

            CommandProcessor.sendCommand(this);
        }

        public override void Send(WebSocket w)
        {
            base.Send(w, this);
        }

        public static string Receive()
        {
            ProjectFetchEvent log = JsonUtility.FromJson<ProjectFetchEvent>(FlowNetworkManager.reply);
            Config.objs = log.objs;

            //Debug.Log(Config.objs[0].objectName);
            return "Receiving project open update: " + FlowNetworkManager.reply;
        }
    }
}
