using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class TestFO : MonoBehaviour {

    float x = 0;
    float delta_x = .1f;

	// Use this for initialization
	void Start () {
	}
	
	// Update is called once per frame
	void Update () {
        if (x < -2 || x > 4)
            delta_x *= -1;

        x += delta_x;

        Transform t = FlowProject.activeProject.transformsById["1"].transform;
        FlowProject.activeProject.transformsById["1"].transform.localPosition = new Vector3(x, t.localPosition.y, t.localPosition.z);
	}
}
