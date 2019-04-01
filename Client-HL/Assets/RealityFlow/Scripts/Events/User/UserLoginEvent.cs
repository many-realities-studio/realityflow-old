using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UnityEngine;

namespace Assets.RealityFlow.Scripts.Events
{
    [System.Serializable]
    public class UserLoginEvent : FlowEvent
    {
        public static int scmd = Commands.User.LOGIN;

        public User user;
        public FlowClient client;
        public FlowProject[] project;

        public UserLoginEvent()
        {
            cmd = scmd;
        }

        public void send(User user, int clientType)
        {
            this.user = user;
            client = new FlowClient();
            client.type = clientType;

            CommandProcessor.sendCommand(this);
        }

        public override void Send(WebSocket w)
        {
            base.Send(w, this);
        }

        public static string Receive()
        {
            UserLoginEvent log = JsonUtility.FromJson<UserLoginEvent>(FlowNetworkManager.reply);
            Config.userId = log.user.userId;
            Config.deviceId = log.client._id;
            Config.projectList = log.project;

            return "Receiving user login update: " + FlowNetworkManager.reply;
        }
    }
}
