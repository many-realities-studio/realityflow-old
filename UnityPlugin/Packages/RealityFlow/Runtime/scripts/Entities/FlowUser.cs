using System.Collections;
using System.Collections.Generic;
using UnityEngine;

namespace RealityFlow.Plugin.Scripts
{
    [System.Serializable]
    public class FlowUser : FlowValue
    {
        public string username;
        public string password;
        public string active_project_id;
        public List<string> client_ids;
        public List<string> project_ids;
        public List<string> friend_ids;

        public FlowUser(string username, string password)

        {
            this.username = username;
            this.password = password;
        }

        public FlowUser(string id)
        {
            _id = id;
        }

        public FlowUser()
        {

        }
    }
}