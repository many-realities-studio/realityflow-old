using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UnityEngine;

namespace Assets.RealityFlow.Scripts.Events
{
    [System.Serializable]
    public class ObjectUpdateEvent : FlowEvent
    {
        public FlowTObject transform;
        public static int scmd = Commands.FlowObject.UPDATE;

        public ObjectUpdateEvent()
        {
            cmd = scmd;
        }

        public void Send(FlowTObject transformToSend)
        {
            transform = transformToSend;
            transform.Read();

            CommandProcessor.sendCommand(this);
        }

        public override void Send(WebSocket w)
        {
            base.Send(w, this);
        }

        public static string Receive()
        {
            ObjectUpdateEvent trans_update_cmd = JsonUtility.FromJson<ObjectUpdateEvent>(FlowNetworkManager.reply);
            FlowTObject local_transform = FlowProject.activeProject.transformsById[trans_update_cmd.transform._id];
            if (trans_update_cmd.transform._id != "1")
            {
                local_transform.Copy(trans_update_cmd.transform);
                local_transform.Update();
            }

            return "Receiving Transform update: " + FlowNetworkManager.reply;
        }
    }
}
