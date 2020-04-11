using RealityFlow.Plugin.Scripts;
using UnityEngine;
using UnityEngine.EventSystems;

public class ListenToPointer : MonoBehaviour, IPointerClickHandler
{
    public void OnPointerClick(PointerEventData eventData)
    {
        FlowTObject flowObject = new FlowTObject(gameObject.name, transform.position + new Vector3(1, 0, 0), Quaternion.identity, Vector3.one, Color.white, gameObject.name);
        FindObjectOfType<NetworkManagerHL>().CreateObject(flowObject);
    }
}