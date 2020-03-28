using RealityFlow.Plugin.Scripts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;

namespace Packages.realityflow_package.Runtime.scripts.Messages.ObjectMessages
{
    [DataContract]
    public class UpdateObject_ReceiveFromServer : ReceivedMessage
    {
        [DataMember]
        public FlowTObject flowObject { get; set; }

        // Definition of event type (What gets sent to the subscribers
        public delegate void UpdateObjectReceived_EventHandler(object sender, UpdateObjectMessageEventArgs eventArgs);

        // The object that handles publishing/subscribing
        private static UpdateObjectReceived_EventHandler _ReceivedEvent;
        public static event UpdateObjectReceived_EventHandler ReceivedEvent
        {
            add
            {
                if (_ReceivedEvent == null || !_ReceivedEvent.GetInvocationList().Contains(value))
                {
                    _ReceivedEvent += value;
                }
            }
            remove
            {
                _ReceivedEvent -= value;
            }
        }

        /// <summary>
        /// Parse message and convert it to the appropriate data type
        /// </summary>
        /// <param name="message">The message to be parsed</param>
        public static void ReceiveMessage(string message)
        {
            UpdateObject_ReceiveFromServer response = UnityEngine.JsonUtility.FromJson<UpdateObject_ReceiveFromServer>(message);
            response.RaiseEvent();
        }

        /// <summary>
        /// Publish to the event to notify all subscribers to this message
        /// </summary>
        public override void RaiseEvent()
        {
            if (_ReceivedEvent != null)
            {
                _ReceivedEvent.Invoke(this, new UpdateObjectMessageEventArgs(this));
            }
        }
    }

    public class UpdateObjectMessageEventArgs : EventArgs
    {
        public UpdateObject_ReceiveFromServer message { get; set; }

        public UpdateObjectMessageEventArgs(UpdateObject_ReceiveFromServer message)
        {
            this.message = message;
        }
    }
}
