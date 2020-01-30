using System.Collections;
using System.Collections.Generic;
using UnityEngine;


namespace RealityFlow.Plugin.Scripts
{
    [System.Serializable]
    public class User : FlowValue
    {
        public string userId;
        public string username;
        public string password;

        public User(string username, string password)
        {
            this.username = username;
            this.password = password;
        }
    }
}