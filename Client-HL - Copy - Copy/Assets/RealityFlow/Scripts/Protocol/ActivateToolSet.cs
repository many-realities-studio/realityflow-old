using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class ActivateToolSet : MonoBehaviour {

    public float scaleFactor = .4f;
    GameObject cursor;
    bool isActive;

    public List<SpriteRenderer> rend;

	// Use this for initialization
	void Start () {

        cursor = GameObject.Find("BasicCursor");
        transform.localScale *= scaleFactor;

	}

    private void OnEnable()
    {
        NRSRManager.objectFocused += activateThis;
        NRSRManager.objectUnFocused += deactivateThis;

        deactivateThis();
    }

    private void OnDisable()
    {
        NRSRManager.objectFocused -= activateThis;
        NRSRManager.objectUnFocused -= deactivateThis;
    }

    void activateThis()
    {
        foreach (SpriteRenderer spriteRend in rend)
            spriteRend.enabled = true;
    }

    void deactivateThis()
    {
        foreach (SpriteRenderer spriteRend in rend)
        {
            spriteRend.enabled = false;
        }
    }
}
