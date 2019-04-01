using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UnityEngine;

namespace Assets.RealityFlow.Scripts.Events.Project
{
    [System.Serializable]
    public class ProjectCreateEvent : FlowEvent
    {
        public static int scmd = Commands.Project.CREATE;

        public FlowProjectRequest fpr;

        public ProjectCreateEvent()
        {
            cmd = scmd;
        }

        public void Send(string projectName)
        {
            fpr = new FlowProjectRequest(projectName, Config.userId, Config.deviceId);

            CommandProcessor.sendCommand(this);
        }

        public override void Send(WebSocket w)
        {
            base.Send(w, this);
        }

        public static string Receive()
        {
            ProjectCreateEvent log = JsonUtility.FromJson<ProjectCreateEvent>(FlowNetworkManager.reply);
            Config.projectIdList.Add(log.fpr.project._id);

            return "Receiving project create update: " + FlowNetworkManager.reply;
        }
    }
}
