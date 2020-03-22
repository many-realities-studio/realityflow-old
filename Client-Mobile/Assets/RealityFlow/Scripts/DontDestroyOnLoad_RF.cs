using System.Collections;
using System.Collections.Generic;
using UnityEngine;

// This simple script ensures the object it is attached to will be preserved between scene transfers.
// An identical script is present in the Hololens preview, but this extra script was created to 
// reduce dependencies, especially on a script from a preview package.

public class DontDestroyOnLoad_RF : MonoBehaviour {

	// Use this for initialization
	void Start () {
        DontDestroyOnLoad(gameObject);
	}
}
