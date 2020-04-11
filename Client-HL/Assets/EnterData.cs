using UnityEngine;
using TMPro;
using RealityFlow.Plugin.Scripts;
using Packages.realityflow_package.Runtime.scripts;

public class EnterData : MonoBehaviour
{
    public TextMeshProUGUI user;
    public TextMeshProUGUI pw;

    private const string Url = "ws://plato.mrl.ai:8999";

    public void SubmitData()
    {
        ConfigurationSingleton.CurrentUser = new FlowUser(user.text, pw.text);

        Operations.ConnectToServer(Url);
    }
}
