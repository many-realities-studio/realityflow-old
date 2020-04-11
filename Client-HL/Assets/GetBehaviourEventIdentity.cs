using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using TMPro;

public class GetBehaviourEventIdentity : MonoBehaviour
{
    public SelectPreviousMenu menu;
    private string id;

    public TextMeshProUGUI name;
    public TextMeshProUGUI second;
    public TextMeshProUGUI isChain;

    public void SetBehaviourEvent(string d, string n, string s, bool c)
    {
        id = d;
        name.text = n;
        second.text = s;
        isChain.text = c.ToString();
    }

    public void RemoveThis()
    {
        menu.SetRemove(id);
    }
}
