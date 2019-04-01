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
        public static int scmd = Commands.Project.FETCH;

        public FlowProject project;

        public ProjectFetchEvent()
        {
            command = scmd;
        }

        public void send()
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
            
            //to be continued

            return "Receiving user login update: " + FlowNetworkManager.reply;
        }
    }
}
