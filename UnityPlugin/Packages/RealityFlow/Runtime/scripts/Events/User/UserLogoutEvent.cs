//using System;
//using System.Collections.Generic;
//using System.Linq;
//using System.Text;
//using UnityEngine;
//using RealityFlow.Plugin.Scripts;

//namespace RealityFlow.Plugin.Scripts.Events
//{
//    [System.Serializable]
//    public class UserLogoutEvent : FlowEvent
//    {
//        public static int scmd = Commands.User.LOGOUT;

//        public FlowUser user;
//        public FlowClient client;

//        public UserLogoutEvent()
//        {
//            command = scmd;
//        }

//        public void Send()
//        {
//            user = new FlowUser(Config.userId);
//            client = new FlowClient(Config.deviceId);

//            CommandProcessor.sendCommand(this);
//        }

//        public override void Send(WebSocket w)
//        {
//            base.Send(w, this);
//        }

//    }
//}
