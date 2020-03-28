using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;

namespace Packages.realityflow_package.Runtime.scripts.Messages
{
    /// <summary>
    /// The purpose of this interface is to provide the information which all messages contain.
    /// (Both those sent to and received from the server)
    /// </summary>
    //[System.Serializable]
    [DataContract]
    public abstract class BaseMessage
    {
        public delegate void ParseMessage(string message); // Definition of a parse message method

        [DataMember]
        public string Message { get; set; } // Gives context to the message (Human readable)
        [DataMember]
        public string MessageType { get; set; } // Type of message being sent
    }
}
