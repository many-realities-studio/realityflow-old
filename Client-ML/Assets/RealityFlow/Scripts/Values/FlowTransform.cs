using UnityEngine;

[System.Serializable]
public class FlowTransform : FlowValue
{
    public float x;
    public float y;
    public float z;
    public float q_x;
    public float q_y;
    public float q_z;
    public float q_w;
    [System.NonSerialized]
    public static int idCount = 0;
    [System.NonSerialized]
    public Transform transform;

    public FlowTransform(GameObject obj) {
        transform = obj.transform;
        x = transform.localPosition.x;
        y = transform.localPosition.y;
        z = transform.localPosition.z;
        q_x = transform.localRotation.x;
        q_y = transform.localRotation.y;
        q_z = transform.localRotation.z;
        q_w = transform.localRotation.w;
    }
    public void Read() {
        x = transform.localPosition.x;
        y = transform.localPosition.y;
        z = transform.localPosition.z;
        q_x = transform.localRotation.x;
        q_y = transform.localRotation.y;
        q_z = transform.localRotation.z;
        q_w = transform.localRotation.w;
    }

    public void Copy(FlowTransform source) {
        x = source.x;
        y = source.y;
        z = source.z;
        q_x = source.q_x;
        q_y = source.q_y;
        q_z = source.q_z;
        q_w = source.q_w;
    }

    public void Update() {
        Vector3 newPos = new Vector3(x, y, z);
        transform.localPosition = newPos;
        Quaternion newRot = new Quaternion(q_x, q_y, q_z, q_w);
        transform.localRotation = newRot;
    }

    public void RegisterTransform() {
        FlowProject.activeProject.transformsById.Add(_id, this);
    }

    public FlowTransform(string _id) {
        id = _id;
        if(_id == null) {
            _id = idCount.ToString() + "t";
        }
    }

    public FlowTransform(float _q_x, float _q_y, float _q_z, float _q_w){
        q_x = _q_x;
        q_y = _q_y;
        q_z = _q_z;
        q_w = _q_w;
    }

    public FlowTransform(float _x, float _y, float _z, string _id){
        x = _x;
        y = _y;
        z = _z;
    }
}