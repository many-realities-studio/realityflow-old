using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using RealityFlow.Plugin.Scripts.Events;
using RealityFlow.Plugin.Scripts;
using System;

public class MainMenuManager : MonoBehaviour {

    // panel IDs
    public const int REDIRECT_PANEL = 0;
    public const int REGISTER_PANEL = 1;
    public const int LOGIN_PANEL = 2;
    public const int PROJECT_PANEL = 3;
    public const int ERROR_PANEL = 4;
    public const int NUM_PANELS = 5;

    // Sentinel id to indicate that no user is currently logged in
    public const string NO_USER = "-9999";
    // Error strings for when login or register attempts fail
    public const string LOGIN_ERR = "Invalid login.";
    public const string REGISTER_ERR = "User already exists or passwords does not match.";

    // Panels
    public GameObject [] panels = new GameObject[NUM_PANELS];
    private int activePanel;

    // Housekeeping variables
    private bool requestPending;
    private bool registerPending;
    private string error;

    // Form variables
    public InputField username;
    public InputField password;
    public InputField confirm;

  

    public void Start()
    {
        activePanel = REDIRECT_PANEL;
        Config.userId = NO_USER;
        requestPending = false;

        if (GameObject.FindGameObjectWithTag("NetworkManager") == null)
        {
            GameObject manager = new GameObject();
            FlowNetworkManager component = manager.AddComponent<FlowNetworkManager>();
            manager.AddComponent<DoOnMainThread>();
            manager.AddComponent<DontDestroyOnLoad_RF>();
            component._debug = true;

            manager.name = "NetworkManager";
            manager.tag = "NetworkManager";
        }
        FlowNetworkManager manager_component = GameObject.FindGameObjectWithTag("NetworkManager").GetComponent<FlowNetworkManager>();
        manager_component.mainGameCamera = GameObject.FindGameObjectWithTag("MainCamera");
        manager_component.eventSystem = GameObject.FindGameObjectWithTag("EventSystem");
    }

    private void Update()
    {
        // If a login is pending and a response has been recieved from the server...
        if (requestPending /*&& Config.userId != NO_USER*/)
        {
            // ... and the userId has been set to a valid Id, load the projects panel.
            if (Config.userId != NO_USER /*""*/)
            {
                panels[PROJECT_PANEL].SetActive(true);
                panels[activePanel].SetActive(false);
                activePanel = PROJECT_PANEL;
                requestPending = false;
            }
            // ... otherwise, display an error message and reset the userId to NO_USER.
            else
            {
                //Debug.Log(error);
            }

        }
    }

    

    public void setActivePanel(int panel)
    {
        //user is logging out
        if (activePanel == PROJECT_PANEL && panel == 0)
            Logout();

        panels[panel].SetActive(true);
        panels[activePanel].SetActive(false);
        activePanel = panel;

        // initialize text fields
        switch (panel)
        {
            case (REDIRECT_PANEL):
                username = null;
                password = null;
                confirm = null;
                break;
            case (REGISTER_PANEL):
                username = panels[activePanel].transform.Find("UsernameField").GetComponent<InputField>();
                password = panels[activePanel].transform.Find("PasswordField").GetComponent<InputField>();
                confirm = panels[activePanel].transform.Find("ConfirmField").GetComponent<InputField>();
                break;
            case (LOGIN_PANEL):
                username = panels[activePanel].transform.Find("UsernameField").GetComponent<InputField>();
                password = panels[activePanel].transform.Find("PasswordField").GetComponent<InputField>();
                break;
            case (PROJECT_PANEL):
                break;
        }
    }

    private void Logout()
    {
        // clear the username and projectList so the next user to login will have a newly populated list
        Config.ResetValues();
    }

    public void login()
    {
        // send json with entered username and password
        UserLoginEvent login = new UserLoginEvent();
        login.Send(username.text, password.text, FlowClient.CLIENT_MOBILE);

        // mark that a login is pending
        requestPending = true;
        error = LOGIN_ERR;
    }

    public void signup()
    {
        if (confirm.text != password.text)
        {
            // error
            if (panels[ERROR_PANEL] != null) panels[ERROR_PANEL].SetActive(true);
            return;
        }
        // send json with entered username, email, and password
        UserRegisterEvent register = new UserRegisterEvent();
        register.Send(username.text, password.text, FlowClient.CLIENT_MOBILE);

        // return to main menu on recieve?
        // No; userId and clientId are both set in the same way as a login, so redirect the user to the
        // project selection screen
        requestPending = true;
        error = REGISTER_ERR;
    }
}
