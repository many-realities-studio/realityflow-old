using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using TMPro;
using RealityFlow.Plugin.Scripts;

public class GetBehaviourEventIdentity : MonoBehaviour
{
    public SelectPreviousMenu menu;
    public SubmitObjectUpdates updates;
    private FlowBehaviour id;

    public TextMeshProUGUI name;
    public TextMeshProUGUI second;
    public TextMeshProUGUI isChain;

    public void SetBehaviourEvent(FlowBehaviour d, string n, string s, bool c)
    {
        id = d;
        name.text = n;
        second.text = s;
        isChain.text = c.ToString();
    }

    public void EditThis()
    {
        updates.SetEdit(id);
    }

    public void RemoveThis()
    {
        menu.SetRemove(id);
    }
}
