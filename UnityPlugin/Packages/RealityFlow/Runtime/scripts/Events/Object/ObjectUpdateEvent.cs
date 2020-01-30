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
    public class ObjectUpdateEvent : FlowEvent
    {
        public FlowTObject obj;
        public static int scmd = Commands.FlowObject.UPDATE;
        public FlowProject project;
        public FlowClient client;

        public ObjectUpdateEvent()
        {
            command = scmd;
        }

        public void Send(FlowTObject transformToSend)
        {
            transformToSend.Read();
            //Debug.Log("Material color on Read: " + transformToSend.material.color.ToString());
            //Debug.Log("color on Read: " + transformToSend.color.ToString());
            obj = new FlowTObject();
            obj.Copy(transformToSend);
            //Debug.Log("color on copy: " + obj.color.ToString());

            //Debug.Log(JsonUtility.ToJson(obj));

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
            ObjectUpdateEvent trans_update_cmd = JsonUtility.FromJson<ObjectUpdateEvent>(FlowNetworkManager.reply);
            FlowTObject local_transform = FlowProject.activeProject.transformsById[trans_update_cmd.obj._id];

            local_transform.Copy(trans_update_cmd.obj);
            local_transform.Update();

            local_transform.flowObject.pastState.Copy(local_transform);

            return "Receiving Transform update: " + FlowNetworkManager.reply;
        }
    }
}
