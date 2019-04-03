using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
//using System.Threading.Tasks;
using UnityEngine;

namespace Assets.RealityFlow.Scripts.Events
{
    [System.Serializable]
    public class ObjectDeleteEvent : FlowEvent
    {
        public FlowTObject obj;
        public static int scmd = Commands.FlowObject.DELETE;

        public ObjectDeleteEvent()
        {
            command = scmd;
        }

        public void Send(string id)
        {
            obj = new FlowTObject();
            obj._id = id;

            project_id = Config.projectId;
            client_id = Config.deviceId;

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
