using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UnityEngine;

namespace Assets.RealityFlow.Scripts.Events.User
{
    [System.Serializable]
    public class UserRegisterEvent : FlowEvent
    {
        public static int scmd = Commands.User.CREATE;

        public FlowUser user;

        public UserRegisterEvent()
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
            UserRegisterEvent log = JsonUtility.FromJson<UserRegisterEvent>(FlowNetworkManager.reply);
            Config.userId = log.user._id;

            return "Receiving user create update: " + FlowNetworkManager.reply;
        }
    }
}
