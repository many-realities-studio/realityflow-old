using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.EventSystems;

public class SelectionManager : MonoBehaviour {

    GameObject lastHit; // Keep track of last object clicked
    public GameObject selected;
    public GameObject Selected
    {
        get { return selected; }
    }

    private void Start()
    {
        lastHit = null;
    }

    // Update is called once per frame
    void Update () {
        RaycastHit hit;
        Ray ray = Camera.main.ScreenPointToRay(Input.mousePosition);
        if (Physics.Raycast(ray, out hit, 100) && Input.GetMouseButtonDown(0) ) // or whatever range, if applicable
        {
            if (hit.transform.gameObject == lastHit)
            {
                // You clicked the same object twice
            }
            else
            {
                if (lastHit != null)
                {
                    var outline = lastHit.GetComponent(typeof(Outline)) as Outline;
                    var selector = lastHit.GetComponent(typeof(Selector)) as Selector;

                    if (outline != null && selector != null && selector.isSelected == true)
                    {
                        selector.isSelected = false;
                        outline.enabled = false;
                    }
                }
                lastHit = hit.transform.gameObject;
                selected = lastHit;
            }
        }
        // Clicked outside of an object.
        else if (Input.GetMouseButtonDown(0) && !EventSystem.current.IsPointerOverGameObject())
        {
            if (lastHit != null)
            {
                var outline = lastHit.GetComponent(typeof(Outline)) as Outline;
                var selector = lastHit.GetComponent(typeof(Selector)) as Selector;

                if (outline != null && selector != null && selector.isSelected == true)
                {
                    selector.isSelected = false;
                    outline.enabled = false;
                }
            }
            selected = null;
        }
    }
}
