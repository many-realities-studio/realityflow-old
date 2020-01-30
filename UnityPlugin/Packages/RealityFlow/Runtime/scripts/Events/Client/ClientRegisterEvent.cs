using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
//using System.Threading.Tasks;
using UnityEngine;
using RealityFlow.Plugin.Scripts;

namespace RealityFlow.Plugin.Scripts.Events
{
    [System.Serializable]
    public class ClientRegisterEvent : FlowEvent
    {
        public static int scmd = Commands.Client.NEW_CLIENT;

        public FlowClient client;
        public FlowUser user;

        public ClientRegisterEvent()
        {
            command = scmd;
        }

        public void Send(int deviceType)
        {
            client = new FlowClient(deviceType);
            user = new FlowUser(Config.userId);

            CommandProcessor.sendCommand(this);
        }

        public override void Send(WebSocket w)
        {
            base.Send(w, this);
        }

        public static string Receive()
        {
            ClientRegisterEvent log = JsonUtility.FromJson<ClientRegisterEvent>(FlowNetworkManager.reply);
            Config.deviceId = log.client._id;

            return "Receiving client create update: " + FlowNetworkManager.reply;
        }
    }
}
