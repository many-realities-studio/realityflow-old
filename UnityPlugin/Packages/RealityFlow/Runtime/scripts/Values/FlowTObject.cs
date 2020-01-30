using UnityEngine;
using RealityFlow.Plugin.Scripts;

namespace RealityFlow.Plugin.Scripts
{
    [System.Serializable]
    public class FlowTObject : FlowValue
    {
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
        public string name;
        public Vector3[] vertices;
        public Vector2[] uv;
        public byte[] texture;
        public int textureHeight;
        public int textureWidth;
        public int textureFormat;
        public int mipmapCount;
        public Color color;
        [System.NonSerialized]
        public static int idCount = 0;
        [System.NonSerialized]
        public Transform transform;
        [System.NonSerialized]
        public Mesh mesh;
        public Material material;
        public FlowObject flowObject;

        public FlowTObject()
        {

        }

        public FlowTObject(GameObject obj)
        {
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
            mesh = obj.GetComponent<MeshFilter>().mesh;
            triangles = mesh.triangles;
            uv = mesh.uv;
            vertices = mesh.vertices;
            name = obj.name;
            material = obj.GetComponent<MeshRenderer>().material;
            color = material.color;
            // if (material.mainTexture != null)
            // {
            //     texture = ((Texture2D)material.mainTexture).GetRawTextureData();
            //     textureHeight = ((Texture2D)material.mainTexture).height;
            //     textureWidth = ((Texture2D)material.mainTexture).width;
            //     textureFormat = (int)((Texture2D)material.mainTexture).format;
            //     mipmapCount = ((Texture2D)material.mainTexture).mipmapCount;
            // }
            type = "BoxCollider";
        }
        public void Read()
        {
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
            color = material.color;
            //vertices = mesh.vertices;
            //uv = mesh.uv;
            //triangles = mesh.triangles;
        }

        public void Read(GameObject go)
        {
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
            material = go.GetComponent<MeshRenderer>().material;
            color = material.color;
            //Mesh newMesh = go.GetComponent<MeshFilter>().mesh;
            //vertices = newMesh.vertices;
            //uv = newMesh.uv;
            //triangles = newMesh.triangles;
            //name = go.name;
            //type = "BoxCollider";

        }

        public void Copy(FlowTObject source)
        {
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
            _id = source._id;
            color = source.color;
            //vertices = source.mesh.vertices;
            //uv = source.mesh.uv;
            //triangles = source.mesh.triangles;
            //name = source.name;
            //type = "BoxCollider";
        }

        public bool Equals(FlowTObject fo)
        {
            if (x != fo.x || y != fo.y || z != fo.z ||
               q_x != fo.q_x || q_y != fo.q_y || q_z != fo.q_z ||
               s_x != fo.s_x || s_y != fo.s_y || s_z != fo.s_z ||
               color != fo.color)
                return false;

            return true;
        }

        public void Update()
        {
            Vector3 newPos = new Vector3(x, y, z);
            transform.localPosition = newPos;
            Quaternion newRot = new Quaternion(q_x, q_y, q_z, q_w);
            transform.localRotation = newRot;
            Vector3 newScale = new Vector3(s_x, s_y, s_z);
            transform.localScale = newScale;
            material.color = color;
            //mesh.vertices = vertices;
            //mesh.uv = uv;
            //mesh.triangles = triangles;
            //mesh.RecalculateBounds();
            //mesh.RecalculateNormals();
        }

        public void RegisterTransform()
        {
            FlowProject.activeProject.transformsById.Add(_id, this);
        }

        public FlowTObject(string _id)
        {
            id = _id;
            if (_id == null)
            {
                _id = idCount.ToString() + "t";
            }
        }

        public FlowTObject(float _q_x, float _q_y, float _q_z, float _q_w)
        {
            q_x = _q_x;
            q_y = _q_y;
            q_z = _q_z;
            q_w = _q_w;
        }

        public FlowTObject(float _x, float _y, float _z, string _id)
        {
            x = _x;
            y = _y;
            z = _z;
        }

        public FlowTObject(float _s_x, float _s_y, float _s_z)
        {
            s_x = _s_x;
            s_y = _s_y;
            s_z = _s_z;
        }


    }
}
