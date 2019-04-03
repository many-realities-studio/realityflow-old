using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UnityEngine;

namespace Assets.RealityFlow.Scripts.Events
{
    [System.Serializable]
    public class ProjectFetchEvent : FlowEvent
    {
        public static int scmd = Commands.Project.OPEN;

        public FlowProject project;
        public List<FlowTObject> objs;
        public FlowClient client;

        public ProjectFetchEvent()
        {
            command = scmd;
        }

        public void Send()
        {
            project = new FlowProject(Config.projectId);
            client = new FlowClient(Config.deviceId);

            CommandProcessor.sendCommand(this);
        }

        public override void Send(WebSocket w)
        {
            base.Send(w, this);
        }

        public static string Receive()
        {
            ProjectFetchEvent log = new ProjectFetchEvent();
            JsonUtility.FromJsonOverwrite(FlowNetworkManager.reply, log);
            Config.objs = log.objs;

            //Debug.Log("vertice[0] = " + log.objs[0].vertices[0].x);

            foreach (FlowTObject obj in Config.objs)
            {

                // the array of vectors and UV are returning in the following format: vertices[[{x = 1, y = 2, z = 3}]] instead of vertices[{x = 1, y = 2, z = 3}]
                // therefore unity cant properly deserialize it and you get garbage data instead

                Debug.Log("creating object: " + obj.name);
             //   Debug.Log("creating object: " + obj._id);
              //  Debug.Log("vertice[0] = " + obj.vertices[0].x + "   " + obj.vertices[0].y + "   " + obj.vertices[0].z + "");
               // Debug.Log("uv[0] = " + obj.uv[0].x + "   " + obj.uv[0].y + "   ");
                GameObject newObj = GameObject.CreatePrimitive(PrimitiveType.Cube);

                Mesh objMesh = newObj.GetComponent<MeshFilter>().mesh;
                objMesh.vertices = obj.vertices;
                objMesh.uv = obj.uv;
                objMesh.triangles = obj.triangles;
                objMesh.RecalculateBounds();
                objMesh.RecalculateNormals();
                newObj.transform.localPosition = new Vector3(obj.x, obj.y, obj.z);
                newObj.transform.localRotation = Quaternion.Euler(new Vector4(obj.q_x, obj.q_y, obj.q_z, obj.q_w));
                newObj.transform.localScale = new Vector3(obj.s_x, obj.s_y, obj.s_z);
                MonoBehaviour.Destroy(newObj.GetComponent<Collider>());
                newObj.AddComponent<BoxCollider>();
                newObj.name = obj.name;
                newObj.AddComponent(typeof(FlowObject));
                newObj.GetComponent<FlowObject>().selected = false; // might want to comment this one out
                //newObj.GetComponent<FlowObject>().Start();
                newObj.GetComponent<FlowObject>().ft = new FlowTObject(newObj);
                newObj.GetComponent<FlowObject>().ft._id = obj._id;
                newObj.GetComponent<FlowObject>().ft.id = obj.id;
                //FlowProject.activeProject.RegObj(); //probably don't need this anymore
            }

            //Debug.Log(Config.objs[0].objectName);
            return "Receiving project open update: " + FlowNetworkManager.reply;
        }
    }
}
