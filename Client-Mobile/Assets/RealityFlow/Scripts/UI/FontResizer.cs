using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class FontResizer : MonoBehaviour {

    public Text text;

    public const float REF_WIDTH = 9f;
    public const float REF_HEIGHT = 16f;

    // Use this for initialization
    void Start () {

        float reference = REF_WIDTH / REF_HEIGHT;
        float current = (float) Screen.width / Screen.height;

        float weight = reference / current;
        int newSize = Mathf.FloorToInt(weight * text.fontSize);

        text.fontSize = newSize;
    }
	
	// Update is called once per frame
	void Update () {
		
	}
}
