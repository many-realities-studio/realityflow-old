using System.Collections;
using System.Collections.Generic;
using UnityEngine;

namespace RealityFlow.Plugin.Scripts
{
    [System.Serializable]
    public class FlowUser
    {
        public string Username;
        public string Password;

        public FlowUser(string username, string password)
        {
            this.Username = username;
            this.Password = password;
        }
    }
}