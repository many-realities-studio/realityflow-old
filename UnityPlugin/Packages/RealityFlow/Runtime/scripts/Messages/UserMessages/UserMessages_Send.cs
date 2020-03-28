using RealityFlow.Plugin.Scripts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;

namespace Packages.realityflow_package.Runtime.scripts.Messages.UserMessages
{
    /// <summary>
    /// Send a login request message format
    /// Response: <see cref="Login_Recieved"/>
    /// </summary>
    [DataContract]
    public class Login_SendToServer : BaseMessage
    {
        [DataMember]
        public string Username { get; set; }
        [DataMember]
        public string Password { get; set; }

        public Login_SendToServer(string username, string password)
        {
            this.Username = username;
            this.Password = password;
            this.MessageType = "Login";
        }
    }

    /// <summary>
    /// logout request message format 
    /// Response: <see cref="Logout_Received"/>
    /// </summary>
    public class Logout_SendToServer : BaseMessage
    {
        FlowProject flowProject { get; set; }
    }

    /// <summary>
    /// Register user request message format 
    /// Response: <see cref="RegisterUser_Received"/>
    /// </summary>
    [DataContract]
    public class RegisterUser_SendToServer : BaseMessage
    {
        [DataMember]
        public string Username { get; set; }
        [DataMember]
        public string Password { get; set; }

        public RegisterUser_SendToServer(string username, string password)
        {
            Username = username;
            Password = password;
        }
    }
}
