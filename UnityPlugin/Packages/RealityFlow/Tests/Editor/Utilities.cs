using RealityFlow.Plugin.Scripts;
using System.Collections.Generic;
using System.IO;
using UnityEngine;

namespace RealityFlow.Plugin.Tests
{

    /// <summary>
    /// This class holds all fields and functions
    /// that are used frequently within test files.
    /// Place a function or field here if
    /// it has potential of being called more than twice
    /// in the testing folder.
    /// </summary>
    public static class Utilities
    {
        private static float xPosition = 0.7f;
        private static float yPosition = 0.6f;
        private static float zPosition = 0.5f;
        private static float xQuaternion = 0.12f;
        private static float yQuaternion = 0.13f;
        private static float zQuaternion = 0.14f;
        private static float xScale = 0.44f;
        private static float yScale = 0.55f;
        private static float zScale = 0.66f;
        private static float xUV_1 = 0.11f;
        private static float yUV_1 = 0.22f;
        private static float xUV_2 = 0.33f;
        private static float yUV_2 = 0.44f;
        private static float xVertex_1 = 0.11f;
        private static float yVertex_1 = 0.22f;
        private static float zVertex_1 = 0.33f;
        private static float xVertex_2 = 0.33f;
        private static float yVertex_2 = 0.44f;
        private static float zVertex_2 = 0.55f;
        private static Color currentColor = Color.cyan;
        private static string objectName = "my new object";
        private static string objectType = "BoxCollider";


        /// <summary>
        /// This function sets the member variables of an ObjectData instance
        /// </summary>
        /// <param name="obj">An empty ObjectData instance</param>
        public static void FillObjectWithData(ObjectData obj)
        {
            Vector2[] uvVectors = new Vector2[] { new Vector2(xUV_1, yUV_1), new Vector2(xUV_2, yUV_2) };
            Vector3[] verticesVectors = new Vector3[] { new Vector3(xVertex_1, yVertex_1, zVertex_1), new Vector3(xVertex_2, yVertex_2, zVertex_2) };

            obj.mesh = new Mesh();
            obj.mesh.vertices = verticesVectors;
            obj.mesh.uv = uvVectors;
            obj.mesh.triangles = new int[] { 1, 0, 1 };
            obj.position = new Vector3(xPosition, yPosition, zPosition);
            obj.color = currentColor;
            obj.objectName = objectName;
            obj.scale = new Vector3(xScale, yScale, zScale);
            obj.rotation = new Vector3(xQuaternion, yQuaternion, zQuaternion);
        }


        /// <summary>
        /// This function sets the member variables of a FlowTObject instance
        /// </summary>
        /// <param name="obj">An empty FlowTObject instance</param>
        public static void FillObjectWithData(FlowTObject obj)
        {
            Vector2[] uvVectors = new Vector2[] { new Vector2(xUV_1, yUV_1), new Vector2(xUV_2, yUV_2) };
            Vector3[] verticesVectors = new Vector3[] { new Vector3(xVertex_1, yVertex_1, zVertex_1), new Vector3(xVertex_2, yVertex_2, zVertex_2) };
            Quaternion rotation = Quaternion.Euler(xQuaternion, yQuaternion, zQuaternion);

            obj.triangles = new int[] { 1, 0, 1 };
            obj.vertices = verticesVectors;
            obj.uv = uvVectors;
            obj.x = xPosition;
            obj.y = yPosition;
            obj.z = zPosition;
            obj.q_x = rotation.x;
            obj.q_y = rotation.y;
            obj.q_z = rotation.z;
            obj.q_w = rotation.w;
            obj.s_x = xScale;
            obj.s_y = yScale;
            obj.s_z = zScale;
            obj.type = objectType;
            obj.name = objectName;
            obj.color = currentColor;
        }


        /// <summary>
        /// This function returns a json response from the server
        /// </summary>
        /// <param name="filename">The name of the files that holds the desired response</param>
        /// <returns></returns>
        public static string MockServerResponse(string filename)
        {
            return File.ReadAllText("Assets/editor/Tests/ServerResponses/" + filename);
        }

    }
}