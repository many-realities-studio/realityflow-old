using Behaviours;
using RealityFlow.Plugin.Scripts;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class FillSelections : MonoBehaviour
{
    GameObject current;
    public SubmitObjectUpdates sui;

    private List<GameObject> prefabs = new List<GameObject>();

    public GameObject prefab;

    public void OnEnable()
    {
        current = sui.tiedTo;

        List<FlowBehaviour> iEvents = current.GetComponent<ObjectIsInteractable>().GetAllInteractableEvents();
        Vector3 pos = prefab.transform.position;

        foreach (FlowBehaviour f in iEvents)
        {
            GameObject newone = GameObject.Instantiate(prefab, pos, Quaternion.identity);
            newone.GetComponent<GetBehaviourEventIdentity>().SetBehaviourEvent(f, f.BehaviourName, f.Id, (f.NextBehaviour != null));
            prefabs.Add(newone);
            pos += new Vector3(0, .5f, 0);
        }

        prefab.SetActive(false);
    }

    public void OnDisable()
    {
        foreach (GameObject p in prefabs)
        {
            Destroy(p);
        }

        prefab.SetActive(true);
    }
}
