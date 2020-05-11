using RealityFlow.Plugin.Scripts;
using System.Collections;
using UnityEngine;

public class PopulateProjects : MonoBehaviour
{
    public GameObject flowNetworkManager;
    public GameObject buttonPrefab;
    public GameObject parentList;

    Vector3 addOn;

    public void Initialize()
    {
        var network = flowNetworkManager.GetComponent<NetworkManagerHL>();

        addOn = new Vector3(0, -15, 0);

        Debug.Log("available projects = " + network.availableProjects.Count);

        foreach (FlowProject project in network._ProjectList)
        {
            var button = Instantiate(buttonPrefab, parentList.transform);
            button.transform.localPosition += addOn;
            button.SetActive(true);

            button.GetComponent<Populator>().Initialize(project, network);
            IncrementButtonPos();
        }
    }

    private void IncrementButtonPos()
    {
        addOn += new Vector3(0, -15, 0);
    }
}
