using UnityEngine;
using UnityEngine.UI;
using Packages.realityflow_package.Runtime.scripts;
using System;
using RealityFlow.Plugin.Scripts;
using Config = MobileConfiguration.Config;
using WebSocketSharp;

public class MainMenuManager : MonoBehaviour {

    // panel IDs
    public const int REDIRECT_PANEL = 0;
    public const int REGISTER_PANEL = 1;
    public const int LOGIN_PANEL = 2;
    public const int USERHUB_PANEL = 3;
    public const int ERROR_PANEL = 4;
    public const int NUM_PANELS = 5;

    // Panels
    public GameObject [] panels = new GameObject[NUM_PANELS];
    public static int activePanel = REDIRECT_PANEL;

    // Register Buttons and Panels
    public GameObject registerPanel;
    public GameObject registerErrorPanel;
    public GameObject registerSuccessPanel;
    public Button registerButton;

    // Login Buttons and Panels
    public GameObject loginPanel;
    public GameObject loginErrorPanel;
    public Button loginButton;

    private string uname = null;
    private string pword = null;

    // private const string url = "ws://68e6e63b.ngrok.io";
    private const string url = "ws://localhost:8999/";
    // private const string url = "ws://plato.mrl.ai:8999";


    void Start()
    {
        // Operations.ConnectToServer(url);
        // activePanel = REDIRECT_PANEL;
        // Debug.Log("I'm starting");

        if(Config.LeftProject == true)
        {
            // Config.LeftProject = false;
            setActivePanel(USERHUB_PANEL);
            SetGreeting(ConfigurationSingleton.SingleInstance.CurrentUser.Username);
        }
    }


    void Update()
    {
        if(FlowWebsocket.websocket != null)
        {
            Unity.EditorCoroutines.Editor.EditorCoroutineUtility.StartCoroutine(Operations._FlowWebsocket.ReceiveMessage(), Operations._FlowWebsocket);
        }
    }

    

    public void setActivePanel(int panel)
    {

        if(activePanel == panel)
        {
            panels[activePanel].SetActive(false);
            panels[panel].SetActive(true);
            // Debug.Log("Active panel = " + activePanel + " \tNext Panel = " + panel);
            return;
        }

        panels[panel].SetActive(true);
        panels[activePanel].SetActive(false);
        // Debug.Log("Active panel = " + activePanel + " \tNext Panel = " + panel);
        activePanel = panel;
    }

   

    /// <summary>
    /// Sends a request to the server to create a new account. Redirects to login screen
    /// if successful.
    /// </summary>
    public void Signup()
    {
        string username = registerPanel.transform.Find("UsernameField").GetComponent<InputField>().text;
        string password = registerPanel.transform.Find("PasswordField").GetComponent<InputField>().text;
        string confirm = registerPanel.transform.Find("ConfirmField").GetComponent<InputField>().text;

        if (!password.Equals(confirm))
        {
            registerErrorPanel.SetActive(true);
            registerButton.interactable = false;
            return;
        }
  
        Operations.Register(username, password, url, (sender, e) =>
        {
            
            Debug.Log(e.message);
            if (e.message.WasSuccessful == true)
            {
               // ConfigurationSingleton.isConnected = false;
            }
        });

        //if(ConfigurationSingleton.RegisterError == false)
        //{
            uname = username; pword = password;
            setActivePanel(LOGIN_PANEL);
            registerSuccessPanel.SetActive(true);
       // }

    }



    /// <summary>
    /// Sends a request to server to login. Redirects to the UserHub page if successful.
    /// </summary>
    public void Login()
    {

        string username = loginPanel.transform.Find("UsernameField").GetComponent<InputField>().text;
        string password = loginPanel.transform.Find("PasswordField").GetComponent<InputField>().text;

        FlowUser user = new FlowUser(username, password);
        Operations.Login(user, url, (sender, e) =>
        {
            Debug.Log("Login callback: " + e.message.WasSuccessful.ToString());
            if (e.message.WasSuccessful == true)
            {
                uname = username; pword = password;
                Config.projects = e.message.Projects;
                setActivePanel(USERHUB_PANEL);
                SetGreeting(username);
            }
        });

        if(FlowWebsocket.websocket.ReadyState != WebSocketState.Open)
        {
            loginButton.interactable = false;
            loginErrorPanel.SetActive(true);
        }
    }



    /// <summary>
    /// Sends a request to the server to logout. Redirects to the signup/login page
    /// </summary>
    public void Logout()
    {
        //// clear the username and projectList so the next user to login will have a newly populated list
        //Config.ResetValues();

        // SEND Logout event to server maybe
        FlowUser user = new FlowUser(uname, pword);
        Operations.Logout(user);
 
        setActivePanel(REDIRECT_PANEL);
    }



    /// <summary>
    /// Sets the greeting on the user hub page with the user's name
    /// </summary>
    /// <param name="name"></param>
    public void SetGreeting(string name)
    {
        Text greeting = GameObject.FindGameObjectWithTag("Greeting").GetComponent<Text>();
        if(greeting == null)
        {
            Debug.Log("Greeting is null");
            return;
        }
        //Text greeting = GameObject.Find("Greeting").GetComponent<Text>();
        greeting.text = "Hello " + name + "!";
    }
}
