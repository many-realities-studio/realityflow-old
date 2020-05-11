using UnityEngine;
using TMPro;
using RealityFlow.Plugin.Scripts;
using Packages.realityflow_package.Runtime.scripts;

public class EnterData : MonoBehaviour
{
    public TextMeshProUGUI user;
    public TextMeshProUGUI pw;

    private const string Url = "ws://plato.mrl.ai:8999";
    //private const string Url = "ws://localhost:8999/";

    public void SubmitData()
    {
        ConfigurationSingleton.CurrentUser = new FlowUser(user.text, pw.text);
        Operations.Register(user.text, pw.text, Url, (_, e) => { Debug.Log("Registered " + e.message); });
    }

    public void LogIn()
    {
        ConfigurationSingleton.CurrentUser = new FlowUser(user.text, pw.text);
        Operations.Login(ConfigurationSingleton.CurrentUser, Url, (_, e) => { Debug.Log("Logged In " + e.message); });
        FindObjectOfType<NetworkManagerHL>().PopulateProjects();
    }
}
