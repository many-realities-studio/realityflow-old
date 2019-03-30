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
    public float s_x;
    public float s_y;
    public float s_z;
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
        s_x = transform.localScale.x;
        s_y = transform.localScale.y;
        s_z = transform.localScale.z;
    }
    public void Read() {
        x = transform.localPosition.x;
        y = transform.localPosition.y;
        z = transform.localPosition.z;
        q_x = transform.localRotation.x;
        q_y = transform.localRotation.y;
        q_z = transform.localRotation.z;
        q_w = transform.localRotation.w;
        s_x = transform.localScale.x;
        s_y = transform.localScale.y;
        s_z = transform.localScale.z;
    }

    public void Read(GameObject go) {
        x = go.transform.localPosition.x;
        y = go.transform.localPosition.y;
        z = go.transform.localPosition.z;
        q_x = go.transform.localRotation.x;
        q_y = go.transform.localRotation.y;
        q_z = go.transform.localRotation.z;
        q_w = go.transform.localRotation.w;
        s_x = go.transform.localScale.x;
        s_y = go.transform.localScale.y;
        s_z = go.transform.localScale.z;
    }

    public void Copy(FlowTransform source) {
        x = source.x;
        y = source.y;
        z = source.z;
        q_x = source.q_x;
        q_y = source.q_y;
        q_z = source.q_z;
        q_w = source.q_w;
        s_x = source.s_x;
        s_y = source.s_y;
        s_z = source.s_z;
    }

    public void Update() {
        Vector3 newPos = new Vector3(x, y, z);
        transform.localPosition = newPos;
        Quaternion newRot = new Quaternion(q_x, q_y, q_z, q_w);
        transform.localRotation = newRot;
        Vector3 newScale = new Vector3(s_x,s_y,s_z);
        transform.localScale = newScale;
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

    public FlowTransform(float _s_x, float _s_y, float _s_z){
        s_x = _s_x;
        s_y = _s_y;
        s_z = _s_z;
    }

    
}