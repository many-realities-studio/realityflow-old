using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using TMPro;

public class UpdateInteractionType : MonoBehaviour
{
    public SubmitObjectUpdates s;
    public void UpdateInteraction()
    {
        s.SetInteractionType(name);
    }
}
