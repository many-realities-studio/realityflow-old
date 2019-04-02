using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UnityEngine;

namespace Assets.RealityFlow.Scripts.Events
{
    [System.Serializable]
    public class ProjectCreateEvent : FlowEvent
    {
        public static int scmd = Commands.Project.CREATE;

        public FlowProject project;
        public FlowUser user;
        public FlowClient client;

        public ProjectCreateEvent()
        {
            command = scmd;
        }

        public void Send(string projectName)
        {
            project = new FlowProject(projectName);
            user = new FlowUser(Config.userId);
            client = new FlowClient(Config.deviceId);
  
            CommandProcessor.sendCommand(this);
        }

        public override void Send(WebSocket w)
        {
            base.Send(w, this);
        }

        public static string Receive()
        {
            ProjectCreateEvent log = JsonUtility.FromJson<ProjectCreateEvent>(FlowNetworkManager.reply);
            Config.projectIdList.Add(log.project._id);
            Config.projectId = log.project._id;

            return "Receiving project create update: " + FlowNetworkManager.reply;
        }
    }
}
