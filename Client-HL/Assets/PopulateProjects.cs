using UnityEngine;

public class PopulateProjects : MonoBehaviour
{
    public GameObject flowNetworkManager;
    public GameObject buttonPrefab;
    public GameObject parentList;

    Vector3 addOn;
    // Start is called before the first frame update
    void Awake()
    {
        Initialize();
    }

    private void Initialize()
    {
        var network = flowNetworkManager.GetComponent<NetworkManagerHL>();

        addOn = buttonPrefab.transform.position + new Vector3(0, -38, 0);

        foreach (string project in network.availableProjects)
        {
            var button = Instantiate(buttonPrefab, addOn, Quaternion.identity, parentList.transform);

            button.GetComponent<Populator>().Initialize(project, network);
            IncrementButtonPos();
        }
    }

    private void IncrementButtonPos()
    {
        addOn += new Vector3(0, -38, 0);
    }
}
