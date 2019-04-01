using System.Collections;
using System.Collections.Generic;
using UnityEngine;

[System.Serializable]
public class FlowUser : FlowValue {
    public string userId;
    public string username;
    public string password;
    public string active_project;
    public List<FlowClient> clients;

    public User (string username, string password)
    {
        this.username = username;
        this.password = password;
    }
}