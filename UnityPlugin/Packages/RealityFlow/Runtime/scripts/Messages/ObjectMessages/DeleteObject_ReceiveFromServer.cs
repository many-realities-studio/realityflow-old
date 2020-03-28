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
    public class DeleteObject_ReceiveFromServer : ReceivedMessage
    {
        [DataMember]
        public FlowTObject DeletedObject { get; set; } // The deleted object

        // Definition of event type (What gets sent to the subscribers
        public delegate void DeleteObjectReceived_EventHandler(object sender, DeleteObjectMessageEventArgs eventArgs);

        // The object that handles publishing/subscribing
        private static DeleteObjectReceived_EventHandler _ReceivedEvent;
        public static event DeleteObjectReceived_EventHandler ReceivedEvent
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
            DeleteObject_ReceiveFromServer response = UnityEngine.JsonUtility.FromJson<DeleteObject_ReceiveFromServer>(message);
            response.RaiseEvent();
        }

        /// <summary>
        /// Publish to the event to notify all subscribers to this message
        /// </summary>
        public override void RaiseEvent()
        {
            if (_ReceivedEvent != null)
            {
                _ReceivedEvent.Invoke(this, new DeleteObjectMessageEventArgs(this));
            }
        }
    }

    public class DeleteObjectMessageEventArgs : EventArgs
    {
        public DeleteObject_ReceiveFromServer message { get; set; }

        public DeleteObjectMessageEventArgs(DeleteObject_ReceiveFromServer message)
        {
            this.message = message;
        }
    }
}
