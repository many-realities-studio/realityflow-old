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
    public class FinalizedUpdateObject_ReceiveFromServer : ReceivedMessage
    {
        [DataMember]
        public FlowTObject flowObject { get; set; }
        
        // Definition of event type (What gets sent to the subscribers
        public delegate void OpenProjectReceived_EventHandler(object sender, FinalizedUpdateObjectMessageEventArgs eventArgs);

        // The object that handles publishing/subscribing
        private static OpenProjectReceived_EventHandler _ReceivedEvent;
        public static event OpenProjectReceived_EventHandler ReceivedEvent
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
            FinalizedUpdateObject_ReceiveFromServer response = UnityEngine.JsonUtility.FromJson<FinalizedUpdateObject_ReceiveFromServer>(message);
            response.RaiseEvent();
        }

        /// <summary>
        /// Publish to the event to notify all subscribers to this message
        /// </summary>
        public override void RaiseEvent()
        {
            // Raise the event in a thread-safe manner using the ?. operator.
            if (_ReceivedEvent != null)
            {
                _ReceivedEvent.Invoke(this, new FinalizedUpdateObjectMessageEventArgs(this));
            }
        }
    }

    public class FinalizedUpdateObjectMessageEventArgs : EventArgs
    {
        public FinalizedUpdateObject_ReceiveFromServer message { get; set; }

        public FinalizedUpdateObjectMessageEventArgs(FinalizedUpdateObject_ReceiveFromServer message)
        {
            this.message = message;
        }
    }
}
