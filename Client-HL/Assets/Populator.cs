using UnityEngine;
using UnityEngine.UI;
using TMPro;
using Packages.realityflow_package.Runtime.scripts;
using RealityFlow.Plugin.Scripts;

public class Populator : MonoBehaviour
{
    public TextMeshProUGUI localText;
    private NetworkManagerHL network;
    private string id;

    public void Initialize(FlowProject project, NetworkManagerHL n)
    {
        localText.text = project.ProjectName;
        id = project.Id;
        GetComponent<Button>().onClick.AddListener(LoadThisProject);
        network = n;
    }


    public void LoadThisProject()
    {
        if (localText.text != "Prefab")
        {
            transform.root.gameObject.SetActive(false);
            network.OpenProject(localText.text, id);
        }
    }
}
