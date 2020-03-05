using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Packages.realityflow_package.Runtime.scripts.Messages.UserMessages
{
    public class RegisterUser_Received : ConfirmationMessage_Received
    {
        // Definition of event type (What gets sent to the subscribers
        public delegate void RegisterUserReceived_EventHandler(object sender, ConfirmationMessageEventArgs eventArgs);

        // The object that handles publishing/subscribing
        private static RegisterUserReceived_EventHandler _ReceivedEvent;
        public static event RegisterUserReceived_EventHandler ReceivedEvent
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
            ConfirmationMessage_Received response = UnityEngine.JsonUtility.FromJson<ConfirmationMessage_Received>(message);
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
                _ReceivedEvent.Invoke(this, new ConfirmationMessageEventArgs(this));
            }
        }
    }
}
