using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;
using UnityEngine;

namespace Packages.realityflow_package.Runtime.scripts.Messages
{
    /// <summary>
    /// Received message format for pass/fail requests
    /// </summary>
    [DataContract]
    public abstract class ConfirmationMessage_Received : ReceivedMessage
    {
        [DataMember]
        public bool WasSuccessful { get; set; }
    }

    public class ConfirmationMessageEventArgs : EventArgs
    {
        public ConfirmationMessage_Received message { get; set; }

        public ConfirmationMessageEventArgs(ConfirmationMessage_Received message)
        {
            this.message = message;
        }
    }
}
