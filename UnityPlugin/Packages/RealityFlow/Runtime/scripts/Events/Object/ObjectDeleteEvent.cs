using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
//using System.Threading.Tasks;
using UnityEngine;
using RealityFlow.Plugin.Scripts;

namespace RealityFlow.Plugin.Scripts.Events
{
    [System.Serializable]
    public class ObjectDeleteEvent : FlowEvent
    {
        public FlowTObject obj;
        public FlowProject project;
        public FlowClient client;
        public static int scmd = Commands.FlowObject.DELETE;

        public ObjectDeleteEvent()
        {
            command = scmd;
        }

        public void Send(string id)
        {
            obj = new FlowTObject();
            obj._id = id;

            project = new FlowProject();
            project._id = Config.projectId;

            
            client = new FlowClient();
            client._id = Config.deviceId;

            CommandProcessor.sendCommand(this);
        }

        public override void Send(WebSocket w)
        {
            base.Send(w, this);
        }

        public static string Receive()
        {
            ObjectDeleteEvent obj_delete_evt = JsonUtility.FromJson<ObjectDeleteEvent>(FlowNetworkManager.reply);
            FlowTObject objToDelete = FlowProject.activeProject.transformsById[obj_delete_evt.obj._id];

            FlowProject.activeProject.transformsById.Remove(obj_delete_evt.obj._id);
            UnityEngine.Object.Destroy(objToDelete.transform.gameObject);

            return "Receiving Object Delete Update " + FlowNetworkManager.reply;
        }
    }
}
