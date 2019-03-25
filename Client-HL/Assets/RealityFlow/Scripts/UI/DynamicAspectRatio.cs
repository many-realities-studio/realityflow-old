<<<<<<< HEAD
﻿using System.Collections;
using System.Collections.Generic;
using UnityEngine;

/* 
* Script courtesy of unity answers user siddharth3322
* https://answers.unity.com/questions/618058/mobile-device-screen-sizes.html
* The script currently adds a letterbox effect if the window aspect does not match
* the target aspect. If time allows, I'd like to change this to dynamically resize
* the UI components instead, as they should be cut up to allow such deformation.
* 
*/

public class DynamicAspectRatio : MonoBehaviour {

    // Use this for initialization
    void Start()
    {
        // set the desired aspect ratio (the values in this example are
        // hard-coded for 9:16, but you could make them into public
        // variables instead so you can set them at design time)
        float targetaspect = 9.0f / 16.0f;

        // determine the game window's current aspect ratio
        float windowaspect = (float) Screen.width / (float) Screen.height;

        // current viewport height should be scaled by this amount
        float scaleheight = windowaspect / targetaspect;

        // obtain camera component so we can modify its viewport
        Camera camera = GetComponent<Camera>();

        // if scaled height is less than current height, add letterbox
        if (scaleheight < 1.0f)
        {
            Rect rect = camera.rect;

            rect.width = 1.0f;
            rect.height = scaleheight;
            rect.x = 0;
            rect.y = (1.0f - scaleheight) / 2.0f;

            camera.rect = rect;
        }
        else // add pillarbox
        {
            float scalewidth = 1.0f / scaleheight;

            Rect rect = camera.rect;

            rect.width = scalewidth;
            rect.height = 1.0f;
            rect.x = (1.0f - scalewidth) / 2.0f;
            rect.y = 0;

            camera.rect = rect;
        }
    }

    // Update is called once per frame
    void Update () {
		
	}
}
=======
﻿using System.Collections;
using System.Collections.Generic;
using UnityEngine;

/* 
* Script courtesy of unity answers user siddharth3322
* https://answers.unity.com/questions/618058/mobile-device-screen-sizes.html
* The script currently adds a letterbox effect if the window aspect does not match
* the target aspect. If time allows, I'd like to change this to dynamically resize
* the UI components instead, as they should be cut up to allow such deformation.
* 
*/

public class DynamicAspectRatio : MonoBehaviour {

    // Use this for initialization
    void Start()
    {
        // set the desired aspect ratio (the values in this example are
        // hard-coded for 9:16, but you could make them into public
        // variables instead so you can set them at design time)
        float targetaspect = 9.0f / 16.0f;

        // determine the game window's current aspect ratio
        float windowaspect = (float) Screen.width / (float) Screen.height;

        // current viewport height should be scaled by this amount
        float scaleheight = windowaspect / targetaspect;

        // obtain camera component so we can modify its viewport
        Camera camera = GetComponent<Camera>();

        // if scaled height is less than current height, add letterbox
        if (scaleheight < 1.0f)
        {
            Rect rect = camera.rect;

            rect.width = 1.0f;
            rect.height = scaleheight;
            rect.x = 0;
            rect.y = (1.0f - scaleheight) / 2.0f;

            camera.rect = rect;
        }
        else // add pillarbox
        {
            float scalewidth = 1.0f / scaleheight;

            Rect rect = camera.rect;

            rect.width = scalewidth;
            rect.height = 1.0f;
            rect.x = (1.0f - scalewidth) / 2.0f;
            rect.y = 0;

            camera.rect = rect;
        }
    }

    // Update is called once per frame
    void Update () {
		
	}
}
>>>>>>> 8592be32e56dfeab7e1fa58ed0fe1b8046b73170
