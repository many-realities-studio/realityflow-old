using RealityFlow.Plugin.Scripts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using UnityEngine;

namespace Packages.realityflow_package.Runtime.scripts.Managers
{
    // TODO: Move these to the FLowTObject class
    public class NewObjectManager
    {
        public static Dictionary<string, GameObject> idToGameObjectMapping = new Dictionary<string, GameObject>();
        // public static GameObject Sphere = GameObject.CreatePrimitive(PrimitiveType.Sphere);
        public static void CreateObjectInUnity(FlowTObject flowObject)
        {
            // TODO: Make compatable with new FlowTObject that uses monoBehavior
            // GameObject newGameObject = new GameObject();

            // flowObject.SavePropertiesToGameObject(newGameObject);
            
            // idToGameObjectMapping.Add(flowObject.FlowId, newGameObject);
        }

        public static GameObject GetObjectById(string id)
        {
            return idToGameObjectMapping[id];
        }

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

        internal static GameObject CreateObjectInUnity(string FlowId, string name)
        {
            GameObject newGameObject = new GameObject(name);
            idToGameObjectMapping.Add(FlowId, newGameObject);

            return newGameObject;
        }

        //public static void EditObject(FlowTObject newValues)
        //{
        //    //GameObject unityGameObject = idToGameObjectMapping[newValues.id];

        //    FlowTObject unityGameObject = idToGameObjectMapping[newValues.FlowId];

        //    newValues.SavePropertiesToGameObject(unityGameObject);

        //    //unityGameObject.transform.position = Sphere.transform.position;

        //    //GameObject flowGameObject = Sphere;

        //    // Sets all properties of the unityGameObject to the new values defined 
        //    // by the flowGameObject
        //    //PropertyInfo[] properties = typeof(GameObject).GetProperties();
        //    //foreach (PropertyInfo property in properties)
        //    //{
        //    //    if(property.PropertyType == typeof(Transform))
        //    //    {
        //    //        property.SetValue(flowGameObject.transform.position, unityGameObject.transform.position);
        //    //    }
        //    //}
        //}
    }
}
