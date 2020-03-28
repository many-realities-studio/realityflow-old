using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Runtime.Serialization;
using System.Runtime.Serialization.Json;
using System.Text;
using System.Threading.Tasks;
using UnityEngine;

namespace Packages.realityflow_package.Runtime.scripts.Messages.UserMessages
{
    /// <summary>
    /// Handle parsing and relaying message information
    /// https://docs.microsoft.com/en-us/dotnet/csharp/language-reference/keywords/event
    /// </summary>
    public class Login_Recieved : ConfirmationMessage_Received
    {
        // Definition of event type (What gets sent to the subscribers
        public delegate void LoginReceived_EventHandler(object sender, ConfirmationMessageEventArgs eventArgs);

        // The object that handles publishing/subscribing
        private static LoginReceived_EventHandler _ReceivedEvent;
        public static event LoginReceived_EventHandler ReceivedEvent
        {
            add
            {
               if(_ReceivedEvent == null || !_ReceivedEvent.GetInvocationList().Contains(value))
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
            DataContractJsonSerializer serializer = new DataContractJsonSerializer(typeof(Login_SendToServer));

            MemoryStream memoryStream = new MemoryStream(Encoding.UTF8.GetBytes(message));
            //serializer.WriteObject(memoryStream, message);
            memoryStream.Position = 0;

            var p2 = (Login_SendToServer)serializer.ReadObject(memoryStream);

            Debug.Log("Message received: " + p2.ToString());
            //ConfirmationMessage_Received response = JsonUtility.FromJson<ConfirmationMessage_Received>(message);

            
            //response?.RaiseEvent();
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
