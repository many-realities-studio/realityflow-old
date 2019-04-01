using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UnityEngine;

namespace Assets.RealityFlow.Scripts.Events
{
    [System.Serializable]
    public class UserRegisterEvent : FlowEvent
    {
        public static int scmd = Commands.User.CREATE;

        public FlowUser user;
        public FlowClient client;

        public UserRegisterEvent()
        {
            command = scmd;
        }

        public void Send(string username, string password, int deviceType)
        {

            user = new FlowUser(username, password);
            client = new FlowClient(deviceType);

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
            Config.deviceId = log.client._id;

            return "Receiving user create update: " + FlowNetworkManager.reply;
        }
    }
}
