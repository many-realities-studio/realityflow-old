//using System;
//using System.Collections.Generic;
//using System.Linq;
//using System.Text;
////using System.Threading.Tasks;
//using UnityEngine;
//using RealityFlow.Plugin.Scripts;

//namespace RealityFlow.Plugin.Scripts.Events
//{
//    [System.Serializable]
//    public class ProjectInviteEvent : FlowEvent
//    {
//        public static int scmd = Commands.Project.INVITE;

//        public FlowProject project;
//        public FlowUser user;

//        public ProjectInviteEvent()
//        {
//            command = scmd;
//        }

//        public void send(string username)
//        {
//            user = new FlowUser();
//            user.Username = username;

//            project = new FlowProject(Config.projectId);

//            CommandProcessor.sendCommand(this);
//        }

//        public override void Send(WebSocket w)
//        {
//            base.Send(w, this);
//        }

//        public static string Receive()
//        {
//            ProjectInviteEvent log = JsonUtility.FromJson<ProjectInviteEvent>(FlowNetworkManager.reply);
//            Config.projectList.Add(log.project);
//            //Config.projectId = log.project._id;

//            //add user project update here (it will add project to the users list)j

//            //add project react code here

//            return "Receiving project invite update: " + FlowNetworkManager.reply;
//        }
//    }
//}
