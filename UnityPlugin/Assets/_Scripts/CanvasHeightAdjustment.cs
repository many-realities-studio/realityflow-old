using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using Microsoft.MixedReality.Toolkit;
using Microsoft.MixedReality.Toolkit.Teleport;
public class CanvasHeightAdjustment : MonoBehaviour
{
   // public GameObject mainCamera;
  // float height;
   // RectTransform rt;
    // Start is called before the first frame update
    void Start()
    {
       // rt = this.GetComponent<RectTransform>();
       // height = rt.localPosition.y;
    }

    // Update is called once per frame
    void Update()
    {
       // AdjustHeight();
    }
    public void AdjustHeight()
    {
       /* float camHeight = mainCamera.transform.position.y;
        float newHeight = height-camHeight;
        Vector3 newTransform = new Vector3(this.transform.position.x,newHeight,this.transform.position.z);
        rt.localPosition += newTransform;*/
        //  TODO: height adjustment
    }
}
