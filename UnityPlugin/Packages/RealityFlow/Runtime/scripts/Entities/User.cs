using System.Collections;
using System.Collections.Generic;
using System.Runtime.Serialization;
using UnityEngine;


namespace RealityFlow.Plugin.Scripts
{
    [DataContract]
    public class User : FlowValue
    {
        [DataMember]
        public string Username { get; set; }
        [DataMember]
        public string Password { get; set; }
        [DataMember]
        public string FlowId { get; set; }

        public User(string username, string password)
        {
            this.Username = username;
            this.Password = password;
        }

    }
}