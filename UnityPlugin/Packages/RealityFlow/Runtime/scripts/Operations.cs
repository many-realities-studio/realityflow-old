using Packages.realityflow_package.Runtime.scripts.Managers;
using Packages.realityflow_package.Runtime.scripts.Messages;
using Packages.realityflow_package.Runtime.scripts.Messages.ObjectMessages;
using Packages.realityflow_package.Runtime.scripts.Messages.ProjectMessages;
using Packages.realityflow_package.Runtime.scripts.Messages.RoomMessages;
using Packages.realityflow_package.Runtime.scripts.Messages.UserMessages;
using RealityFlow.Plugin.Scripts;
//using RealityFlow.Plugin.Scripts.Events;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Packages.realityflow_package.Runtime.scripts
{
    /// <summary>
    /// The purpose of this class is to provide a wrapper for the UnityPlugin,
    /// allowing for easy use with the networking tools
    /// </summary>
    public static class Operations
    {
        private static FlowWebsocket _flowWebsocket;
        public static FlowWebsocket FlowWebsocket { get => _flowWebsocket; }

        static Operations()
        {
            // Set up Object updates
            //DeleteObject_ReceiveFromServer.ReceivedEvent += _DeleteObject;
        }

        //private static void _DeleteObject(object sender, DeleteObjectMessageEventArgs eventArgs)
        //{
        //    // Delete object in unity
        //    NewObjectManager.DestroyObject(eventArgs.message.DeletedObject.FlowId);
        //}

        #region UserOperations

        public static void Login(string username, string password, Login_Recieved.LoginReceived_EventHandler callbackFunction)
        {
            Login_SendToServer loginMessage = new Login_SendToServer(username, password);
            FlowWebsocket.SendMessage(loginMessage);

            Login_Recieved.ReceivedEvent += callbackFunction;
        }
        
        public static void Logout(Logout_Received.LogoutReceived_EventHandler callbackFunction)
        {
            Logout_SendToServer logoutMessage = new Logout_SendToServer();
            FlowWebsocket.SendMessage(logoutMessage);

            Logout_Received.ReceivedEvent += callbackFunction;
        }

        public static void Register(string username, string password, RegisterUser_Received.RegisterUserReceived_EventHandler callbackFunction)
        {
            RegisterUser_SendToServer register = new RegisterUser_SendToServer(username, password);
            FlowWebsocket.SendMessage(register);

            RegisterUser_Received.ReceivedEvent += callbackFunction;
        }

        #endregion // UserOperations

        #region ObjectOperations
        public static void CreateObject(FlowTObject flowObject, FlowUser flowUser, string projectId, CreateObject_Received.CreateObjectReceived_EventHandler callbackFunction)
        {
            CreateObject_SendToServer createObject =
                new CreateObject_SendToServer(flowObject, flowUser, projectId);
            FlowWebsocket.SendMessage(createObject);

            CreateObject_Received.ReceivedEvent += callbackFunction;
        }

        public static void DeleteObject(string idOfObjectToDelete, DeleteObject_ReceiveFromServer.DeleteObjectReceived_EventHandler callbackFunction)
        {
            DeleteObject_SendToServer deleteObject = new DeleteObject_SendToServer(idOfObjectToDelete);
            FlowWebsocket.SendMessage(deleteObject);

            DeleteObject_ReceiveFromServer.ReceivedEvent += callbackFunction;
        }

        #endregion // ObjectOperations

        #region ProjectOperations
        public static void CreateProject(FlowProject flowProject, FlowUser flowUser, CreateProject_Received.CreateProjectReceived_EventHandler callbackFunction)
        {
            CreateProject_SendToServer createProject = new CreateProject_SendToServer(flowProject, flowUser);
            FlowWebsocket.SendMessage(createProject);

            CreateProject_Received.ReceivedEvent += callbackFunction;
        }

        public static void DeleteProject(FlowProject flowProject, FlowUser flowUser, DeleteObject_ReceiveFromServer.DeleteObjectReceived_EventHandler callbackFunction)
        {
            DeleteProject_SendToServer deleteProject = new DeleteProject_SendToServer(flowProject, flowUser);
            FlowWebsocket.SendMessage(deleteProject);

            DeleteObject_ReceiveFromServer.ReceivedEvent += callbackFunction;
        }

        public static void OpenProject(string projectId, FlowUser flowUser, OpenProject_Received.OpenProjectReceived_EventHandler callbackFunction)
        {
            OpenProject_SendToServer openProject = new OpenProject_SendToServer(projectId, flowUser);
            FlowWebsocket.SendMessage(openProject);

            OpenProject_Received.ReceivedEvent += callbackFunction;
        }

        public static void GetAllUserProjects(FlowUser flowUser, GetAllUserProjects_Received.GetAllUserProjects_EventHandler callbackFunction)
        {
            GetAllUserProjects_SendToServer getAllUserProjects = new GetAllUserProjects_SendToServer(flowUser);
            FlowWebsocket.SendMessage(getAllUserProjects);

            GetAllUserProjects_Received.ReceivedEvent += callbackFunction;
        }

        #endregion // ProjectOperations

        #region RoomMessages

        public static void JoinRoom(string projectId, FlowUser flowUser, JoinRoom_ReceivedFromServer.JoinRoomReceived_EventHandler callbackFunction)
        {
            JoinRoom_SendToServer joinRoom = new JoinRoom_SendToServer(projectId, flowUser);
            FlowWebsocket.SendMessage(joinRoom);

            JoinRoom_ReceivedFromServer.ReceivedEvent += callbackFunction;
        }

        #endregion // Room Messages

        /// <summary>
        /// Establish a connection to the server
        /// </summary>
        /// <param name="url"></param>
        public static void ConnectToServer(string url)
        {
            _flowWebsocket = new FlowWebsocket(url);
        }

        //public delegate void functionCalledOnUpdate();
        //public static void OnUpdate(functionCalledOnUpdate functionCalledOnUpdate)
        //{
        //    // Handle what the GUI needs to update on every frame
        //    functionCalledOnUpdate();
        //}
    }
}
