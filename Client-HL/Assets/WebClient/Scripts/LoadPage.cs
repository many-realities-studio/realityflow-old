using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.SceneManagement;
using UnityEngine.UI;
using Assets.RealityFlow.Scripts.Events;

public class LoadPage : MonoBehaviour {

    public InputField username;
    public InputField password;

    public void logIntoMain(string sceneName)
    {
        UserLoginEvent logServer = new UserLoginEvent();
        logServer.Send(username.text, password.text);
        
        SceneManager.LoadScene (sceneName) ;
    }

    public void registerAccount()
    {
        UserRegisterEvent regServer = new UserRegisterEvent();
        regServer.Send(username.text, password.text, FlowNetworkManager.CLIENT_WEB);
    }
        
}
