using RealityFlow.Plugin.Scripts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;

namespace Packages.realityflow_package.Runtime.scripts.Messages.RoomMessages
{
    /// <summary>
    /// Receive: <see cref="JoinRoom_ReceivedFromServer"/>
    /// </summary>
    [DataContract]
    public class JoinRoom_SendToServer : BaseMessage
    {
        [DataMember]
        public string projectId { get; set; }
        [DataMember]
        public FlowUser flowUser { get; set; }

        public JoinRoom_SendToServer(string projectId, FlowUser flowUser)
        {
            this.projectId = projectId;
            this.flowUser = flowUser;
        }
    }
}
