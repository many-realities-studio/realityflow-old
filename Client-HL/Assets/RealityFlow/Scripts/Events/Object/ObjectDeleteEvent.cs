using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UnityEngine;

namespace Assets.RealityFlow.Scripts.Entities
{
    [System.Serializable]
    public class ObjectDeleteEvent : FlowEvent
    {
        public FlowTObject objToDelete;
        public static int scmd = Commands.FlowObject.DELETE;

        public ObjectDeleteEvent()
        {
            cmd = scmd;
        }

        public void Send(string id)
        {
            objToDelete = new FlowTObject();
            objToDelete._id = id;

            CommandProcessor.sendCommand(this);
        }

        public override void Send(WebSocket w)
        {
            base.Send(w, this);
        }

        public static string Receive()
        {
            ObjectDeleteEvent obj_delete_evt = JsonUtility.FromJson<ObjectDeleteEvent>(FlowNetworkManager.reply);
            FlowTObject objToDelete = FlowProject.activeProject.transformsById[obj_delete_evt.objToDelete._id];

            FlowProject.activeProject.transformsById.Remove(obj_delete_evt.objToDelete._id);
            UnityEngine.Object.Destroy(objToDelete.transform.gameObject);

            return "Receiving Object Delete Update " + FlowNetworkManager.reply;
        }
    }
}
