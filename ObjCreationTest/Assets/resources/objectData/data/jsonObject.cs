using System.Collections;
using System.Collections.Generic;
using UnityEngine;

[System.Serializable]
public class jsonObject : FlowValue {
    
	public int[] triangles;
	public float x;
    public float y;
    public float z;
    public float q_x;
    public float q_y;
    public float q_z;
    public float q_w;
    public float s_x;
    public float s_y;
    public float s_z;
	public string type;
	//public string id;
    public string objectName;
	public Vector3[] vertices;
	public Vector2[] uv;
}
