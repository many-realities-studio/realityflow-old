using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using Assets.RealityFlow.Scripts.Events;

public class MainMenuManager : MonoBehaviour {

    public Text username;
    public Text email;
    public Text password;
	
    public void login()
    {
        // send json with entered username and password
        // make email and username the same field so users can log in with either?
        UserLoginEvent login = new UserLoginEvent();
        login.Send(username.text, password.text);
    }

    public void signup()
    {
        // send json with entered username, email, and password
        UserRegisterEvent register = new UserRegisterEvent();
        register.Send(username.text, password.text, FlowClient.CLIENT_MOBILE);
    }
}
