using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;

namespace Packages.realityflow_package.Runtime.scripts.Messages.ProjectMessages
{
    /// <summary>
    /// Message format of a response from the server upon a request of a list of all projects that a user has
    /// </summary>
    [DataContract]
    public class GetAllUserProjects_Received : ReceivedMessage
    {
        [DataMember]
        Tuple<string, string>[] projectList { get; set; } // in the format of <ProjectId, Name>

        // Definition of event type (What gets sent to the subscribers
        public delegate void GetAllUserProjects_EventHandler(object sender, GetAllUserProjectsMessageEventArgs eventArgs);

        // The object that handles publishing/subscribing
        private static GetAllUserProjects_EventHandler _ReceivedEvent;
        public static event GetAllUserProjects_EventHandler ReceivedEvent
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
            GetAllUserProjects_Received response = UnityEngine.JsonUtility.FromJson<GetAllUserProjects_Received>(message);
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
                _ReceivedEvent.Invoke(this, new GetAllUserProjectsMessageEventArgs(this));
            }
        }
    }

    public class GetAllUserProjectsMessageEventArgs : EventArgs
    {
        public GetAllUserProjects_Received message { get; set; }

        public GetAllUserProjectsMessageEventArgs(GetAllUserProjects_Received message)
        {
            this.message = message;
        }
    }
}
