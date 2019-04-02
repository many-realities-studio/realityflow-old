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

        public ProjectFetchEvent()
        {
            command = scmd;
        }

        public void Send()
        {
            project = new FlowProject(Config.projectId);

            CommandProcessor.sendCommand(this);
        }

        public override void Send(WebSocket w)
        {
            base.Send(w, this);
        }

        public static string Receive()
        {
            ProjectFetchEvent log = JsonUtility.FromJson<ProjectFetchEvent>(FlowNetworkManager.reply);
            Config.objs = log.objs;

            foreach (FlowTObject obj in Config.objs)
            {
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
                newObj.GetComponent<FlowObject>().Start();
                newObj.GetComponent<FlowObject>().ft._id = obj._id;
                newObj.GetComponent<FlowObject>().ft.id = obj.id;
                //FlowProject.activeProject.RegObj(); //probably don't need this anymore
            }

            //Debug.Log(Config.objs[0].objectName);
            return "Receiving project open update: " + FlowNetworkManager.reply;
        }
    }
}
