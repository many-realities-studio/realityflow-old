using UnityEngine;
using RealityFlow.Plugin.Scripts;
using System.Runtime.Serialization;
using System.Reflection;
using Packages.realityflow_package.Runtime.scripts;
using Packages.realityflow_package.Runtime.scripts.Managers;
using System.Collections.Generic;
using System;

namespace RealityFlow.Plugin.Scripts
{
    [System.Serializable]
    [DataContract]
    public class FlowTObject : FlowValue
    {
        public static Dictionary<string, GameObject> idToGameObjectMapping = new Dictionary<string, GameObject>();
        //public int[] Triangles;
        //private string flowId;
        //private float _x;
        //private float _y;
        //private float _z;
        //private float _q_x;
        //private float _q_y;
        //private float _q_z;
        //private float _q_w;
        //private float _s_x;
        //private float _s_y;
        //private float _s_z;
        //private string name;
        //public Vector2[] Uv;
        //public byte[] Texture;
        //public int TextureHeight;
        //public int TextureWidth;
        //public int TextureFormat;
        //public int MipmapCount;

        //[System.NonSerialized]
        //public static int idCount = 0;
        //[System.NonSerialized]
        //public Transform transform;
        //[System.NonSerialized]
        //public Mesh mesh;

        [DataMember]
        public string FlowId { get; set; }

        private GameObject _AttachedGameObject = null;
        public GameObject AttachedGameObject
        {
            get
            {
                if(_AttachedGameObject == null)
                {
                    // The game object already exists
                    if(idToGameObjectMapping.ContainsKey(FlowId))
                    {
                        _AttachedGameObject = idToGameObjectMapping[FlowId];
                    }

                    // The game object doesn't exist, but it should by this point 
                    // Can happen when a client receives a create object request when another user created an object
                    else
                    {
                        _AttachedGameObject = new GameObject();
                    }
                }

                return _AttachedGameObject;
            }
            set { _AttachedGameObject = value; }
        }


        public Color Color; // Not serializable - look at old v1 code to find how
        [DataMember]
        public float X
        {
            get => AttachedGameObject.transform.localPosition.x;
            set => AttachedGameObject.transform.localPosition = new Vector3(value, Y, Z);
        }
        [DataMember]
        public float Y 
        { 
            get => AttachedGameObject.transform.localPosition.y;
            set => AttachedGameObject.transform.localPosition = new Vector3(X, value, Z); 
        } 
        [DataMember]
        public float Z 
        {
            get => AttachedGameObject.transform.localPosition.z;
            set => AttachedGameObject.transform.localPosition = new Vector3(X, Y, value);
        }
        [DataMember]
        public float Q_x 
        {
            get => AttachedGameObject.transform.localRotation.x;
            set => AttachedGameObject.transform.localRotation = new Quaternion(value, Q_y, Q_z, Q_w);
        }
        [DataMember]
        public float Q_y 
        { 
            get => AttachedGameObject.transform.localRotation.y;
            set => AttachedGameObject.transform.localRotation = new Quaternion(Q_x, value, Q_z, Q_w);
        }
        [DataMember]
        public float Q_z 
        { 
            get => AttachedGameObject.transform.localRotation.z;
            set => AttachedGameObject.transform.localRotation = new Quaternion(Q_x, Q_y, value, Q_w);
        }
        [DataMember]
        public float Q_w 
        {
            get => AttachedGameObject.transform.localRotation.w;
            set => AttachedGameObject.transform.localRotation = new Quaternion(Q_x, Q_y, Q_z, value);
        }
        [DataMember]
        public float S_x 
        {
            get => AttachedGameObject.transform.localScale.x;
            set => AttachedGameObject.transform.localScale = new Vector3(value, S_y, S_z);
        }
        [DataMember]
        public float S_y 
        { 
            get => AttachedGameObject.transform.localScale.y; 
            set => AttachedGameObject.transform.localScale = new Vector3(S_x, value, S_z); 
        }
        [DataMember]
        public float S_z 
        { 
            get => AttachedGameObject.transform.localScale.z; 
            set => AttachedGameObject.transform.localScale = new Vector3(S_x, S_y, value); 
        }
        [DataMember]
        public string Name { get; set; }

        #region Static functions
        public static void DestroyObject(string idOfObjectToDestroy)
        {
            try
            {
                GameObject objectToDestroy = idToGameObjectMapping[idOfObjectToDestroy];
                idToGameObjectMapping.Remove(idOfObjectToDestroy);
                UnityEngine.Object.Destroy(objectToDestroy);
            }
            catch (Exception e)
            {
                Debug.LogError(e.ToString());
            }
        }

        private static GameObject CreateObjectInUnity(string FlowId, string name)
        {
            GameObject newGameObject = new GameObject(name);
            idToGameObjectMapping.Add(FlowId, newGameObject);

            return newGameObject;
        }

        #endregion // Static functions

        public FlowTObject(Color color, string flowId, float x, float y, float z, float q_x, float q_y, float q_z, float q_w, float s_x, float s_y, float s_z, string name)
        {
            try
            {
                AttachedGameObject = CreateObjectInUnity(flowId, name);
                Color = color;
                FlowId = flowId;
                X = x;
                Y = y;
                Z = z;
                Q_x = q_x;
                Q_y = q_y;
                Q_z = q_z;
                Q_w = q_w;
                S_x = s_x;
                S_y = s_y;
                S_z = s_z;

                //_x = x;
                //_y = y;
                //_z = z;
                //_q_x = q_x;
                //_q_y = q_y;
                //_q_z = q_z;
                //_q_w = q_w;
                //_s_x = s_x;
                //_s_y = s_y;
                //_s_z = s_z;
                Name = name;
            }
            catch (System.Exception e)
            {
                Debug.LogError(e.ToString());
                UnityEngine.Object.Destroy(AttachedGameObject);
            }
        }

        /// <summary>
        /// saves the current flowTObject properties to a Unity GameObject
        /// </summary>
        /// <param name="gameObject">GameObject that the information is to be saved to</param>
        public void SavePropertiesToGameObject(GameObject gameObject)
        {
            // TODO: add all properties to the conversion
            gameObject.gameObject.transform.position = new Vector3(X, Y, Z);
            gameObject.gameObject.transform.rotation = new Quaternion(Q_x, Q_y, Q_z, Q_w);
            gameObject.gameObject.transform.localScale = new Vector3(S_x, S_y, S_z);
        }

        /// <summary>
        /// Copy all new values into this object
        /// </summary>
        /// <param name="newValues">The values that should be copied over into this object</param>
        public void UpdateObject(FlowTObject newValues)
        {
            PropertyCopier<FlowTObject, FlowTObject>.Copy(newValues, this);
        }

        //public bool Equals(FlowTObject fo)
        //{
        //    if (x != fo.x || y != fo.y || z != fo.z ||
        //       q_x != fo.q_x || q_y != fo.q_y || q_z != fo.q_z ||
        //       s_x != fo.s_x || s_y != fo.s_y || s_z != fo.s_z ||
        //       color != fo.color)
        //        return false;

        //    return true;
        //}

        public void RegisterTransform()
        {
            //FlowProject.activeProject.transformsById.Add(_id, this);
        }
    }
}
