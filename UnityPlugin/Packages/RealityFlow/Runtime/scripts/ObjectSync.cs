using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEditor;


namespace RealityFlow.Plugin.Scripts
{
    // [ExecuteInEditMode]
    public class ObjectSync : MonoBehaviour
    {

        public ObjectData data;

        public void Update()
        {
            // 1. Retrive json from the database containing updated data from the object

            // 2. Check if the object is already being edited by someone, 
            //    being edited by you, or neither and update data acoordingly

            // 3. Send updated data back to the database
        }

        public void SetData(ObjectData d)
        {
            data = new ObjectData();

            data.prefab = d.prefab;
            data.position = d.position;
            data.rotation = d.rotation;
            data.objectName = d.objectName;
            data.scale = d.scale;
        }
    }
}
