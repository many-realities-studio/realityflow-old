using Microsoft.MixedReality.Toolkit.UI;
using RealityFlow.Plugin.Scripts;
using UnityEngine;
using UnityEngine.EventSystems;

public class ListenToPointer : MonoBehaviour
{
    public void Initialize()
    {
        GetComponent<ManipulationHandler>().OnManipulationStarted.AddListener(ManiStart);
    }
    public void ManiStart(ManipulationEventData eventData)
    {
        FindObjectOfType<NetworkManagerHL>().CreateObject(gameObject.name, transform.position + new Vector3(-1, 0, 0), Quaternion.identity, Vector3.one, Color.white, gameObject.name);
    }
}