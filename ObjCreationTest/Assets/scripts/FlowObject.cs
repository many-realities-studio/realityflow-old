using System.Collections;
using System.Collections.Generic;
using UnityEngine;

// [ExecuteInEditMode]
public class FlowObject : MonoBehaviour {

	public bool selected = false;
	public FlowTransform ft;
	FlowTransformCommand cmd = new FlowTransformCommand();
	
	// void Awake()
	// {
	// 	// This are the parameters to send
	// 	Mesh mesh = gameObject.GetComponent<MeshFilter>().mesh;
	// 	Vector3[] vertices = mesh.vertices;
	// 	Vector2[] uv = mesh.uv;
	// 	int[] triangles = mesh.triangles;
	// 	Vector3 pos = new Vector3(transform.position.x + 3, transform.position.y, transform.position.z);

	// 	Collider collider = gameObject.GetComponent<Collider>();
	// 	string type = collider.GetType().Name;

	// 	Debug.Log("type: " + type);

	// 	// This is how to reconstruct the object
	// 	GameObject obj = GameObject.CreatePrimitive(PrimitiveType.Cube);
	// 	obj.transform.position = pos;
	// 	Mesh newMesh = obj.GetComponent<MeshFilter>().mesh;
	// 	newMesh.vertices = vertices;
	// 	newMesh.uv = uv;
	// 	newMesh.triangles = triangles;
	// 	newMesh.RecalculateBounds();
	// 	newMesh.RecalculateNormals();

	// 	obj.transform.localScale = transform.localScale;
	// 	Destroy(obj.GetComponent<Collider>());
	
	// 	switch (type)
	// 	{
	// 		case "BoxCollider":
	// 		obj.AddComponent<BoxCollider>();
	// 			break;
	// 		case "CapsuleCollider":
	// 		obj.AddComponent<CapsuleCollider>();
	// 			break;
	// 		case "SphereCollider":
	// 		obj.AddComponent<SphereCollider>();
	// 			break;
	// 		case "MeshCollider":
	// 		obj.AddComponent<MeshCollider>();
	// 			break;
	// 	}
	// }
	
	// Use this for initialization
	public void Start () {
	ft = new FlowTransform(gameObject);
	ft.id = "1";
	ft._id = "1";
	cmd.transform = ft;
	FlowObject.fo = this;
	}
	public static FlowObject fo;
	public static void registerObject() {
		fo.ft.RegisterTransform();
	}
	
	// Update is called once per frame
	public void Update () {
		if (selected)
		{
			if(FlowNetworkManager.connection_established) 
			{
				((FlowTransform)cmd.transform).Read(gameObject);
				CommandProcessor.sendCommand(cmd);
			}
		}
	}
}
