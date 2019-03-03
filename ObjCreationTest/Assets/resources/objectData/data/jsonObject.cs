using System.Collections;
using System.Collections.Generic;
using UnityEngine;

[System.Serializable]
public class jsonObject : ScriptableObject {
    
	public int[] triangles;
    public Vector3 position;
    public Vector4 rotation;
    public Vector3 scale;
	public string type;
	public string id;
    public string objectName;
	public Vector3[] vertices;
	public Vector2[] uv;
}
