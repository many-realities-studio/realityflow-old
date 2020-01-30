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
    public class UserLoginEvent : FlowEvent
    {
        public static int scmd = Commands.User.LOGIN;

        public FlowUser user;
        public FlowClient client;
        public List<FlowProject> projects;

        public UserLoginEvent()
        {
            command = scmd;
        }

        public void Send(string username, string password, int deviceType)
        {
            Config.DEVICE_TYPE = deviceType;

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
            UserLoginEvent log = JsonUtility.FromJson<UserLoginEvent>(FlowNetworkManager.reply);
            Config.userId = log.user._id;
            Config.deviceId = log.client._id;
            Config.projectList = log.projects;

            if (Config.projectList == null || !Config.projectList.Any())
                Config.projectList = new List<FlowProject>();

            //Config.projectId = Config.projectList[0]._id;

            Debug.Log("received " + Config.projectList.Count + " projects from user " + Config.userId);
            foreach (FlowProject pid in Config.projectList)
                Debug.Log(pid.projectName);

            return "Receiving user login update: " + FlowNetworkManager.reply;
        }
    }
}
