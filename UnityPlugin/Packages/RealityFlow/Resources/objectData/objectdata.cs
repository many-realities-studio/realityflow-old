using System.Collections;
using System.Collections.Generic;
using UnityEngine;

// This script is used by the editor window to store the values to be used to create a new object

namespace RealityFlow.Plugin.Scripts
{
    [CreateAssetMenuAttribute(fileName = "objectData", menuName = "FlowObject")]
    public class ObjectData : ScriptableObject
    {

        public GameObject prefab;
        public Vector3 position;
        public Vector3 rotation;
        public Vector3 scale = new Vector3(1, 1, 1);
        public Color color = new Color(1, 1, 1, 1);
        public string objectName;
        public Mesh mesh;
        public Texture2D texture;
    }
}
