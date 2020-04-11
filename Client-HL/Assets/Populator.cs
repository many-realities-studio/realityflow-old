using UnityEngine;
using UnityEngine.UI;
using TMPro;
using Packages.realityflow_package.Runtime.scripts;
using RealityFlow.Plugin.Scripts;

public class Populator : MonoBehaviour
{
    public TextMeshProUGUI localText;
    private NetworkManagerHL network;

    public void Initialize(string project, NetworkManagerHL n)
    {
        localText.text = project;
        GetComponent<Button>().onClick.AddListener(LoadThisProject);
        network = n;
    }


    public void LoadThisProject()
    {
        if (localText.text != "Available Projects")
        {
            transform.root.gameObject.SetActive(false);
        }
    }
}
