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

        public FlowUser user;

        public UserLoginEvent()
        {
            cmd = scmd;
        }

        public void send(FlowUser user)
        {
            this.user = user;

            CommandProcessor.sendCommand(this);
        }

        public override void Send(WebSocket w)
        {
            base.Send(w, this);
        }

        public static string Receive()
        {
            UserLoginEvent log = JsonUtility.FromJson<UserLoginEvent>(FlowNetworkManager.reply);
            Config.userId = log.user._id;
            Config.projectIdList = log.user.project_ids;

            return "Receiving user login update: " + FlowNetworkManager.reply;
        }
    }
}
