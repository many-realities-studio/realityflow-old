using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using UnityEngine;

namespace Assets.RealityFlow.Scripts.Events
{
    [System.Serializable]
    public class UserLogoutEvent : FlowEvent
    {
        public static int scmd = Commands.User.LOGOUT;

        public FlowUser user;
        public FlowClient client;

        public UserLogoutEvent()
        {
            command = scmd;
        }

        public void Send()
        {
            user = new FlowUser(Config.userId);
            client = new FlowClient(Config.deviceId);

            CommandProcessor.sendCommand(this);
        }
    }
}
