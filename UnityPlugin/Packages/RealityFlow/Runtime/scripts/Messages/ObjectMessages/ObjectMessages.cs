using RealityFlow.Plugin.Scripts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;

namespace Packages.realityflow_package.Runtime.scripts.Messages.ObjectMessages
{
    /// <summary>
    /// Response: <see cref="CreateObject_Received"/>
    /// </summary>
    [DataContract]
    public class CreateObject_SendToServer : BaseMessage
    {
        [DataMember]
        public FlowTObject flowObject { get; set; }
        [DataMember]
        public FlowUser flowUser { get; set; }
        [DataMember]
        public string projectId { get; set; }

        public CreateObject_SendToServer(FlowTObject flowObject, FlowUser flowUser, string projectId)
        {
            this.flowObject = flowObject;
            this.flowUser = flowUser;
            this.projectId = projectId;
        }
    }

    /// <summary>
    /// Response: <see cref="UpdateObject_ReceiveFromServer"/>
    /// </summary>
    [DataContract]
    public class UpdateObject_SendToServer : BaseMessage
    {
        [DataMember]
        public FlowTObject flowObject { get; set; }
        [DataMember]
        public FlowUser flowUser { get; set; }
        [DataMember]
        public string projectId { get; set; }

        public UpdateObject_SendToServer(FlowTObject flowObject, FlowUser flowUser, string projectId)
        {
            this.flowObject = flowObject;
            this.flowUser = flowUser;
            this.projectId = projectId;
        }
    }

    /// <summary>
    /// Response: <see cref="DeleteObject_ReceiveFromServer"/>
    /// </summary>
    [DataContract]
    public class DeleteObject_SendToServer : BaseMessage
    {
        [DataMember]
        public string FlowId{ get; set; } // Id of the deleted object

        public DeleteObject_SendToServer(string flowId)
        {
            FlowId = flowId;
        }
    }

    /// <summary>
    /// Response: <see cref="FinalizedUpdateObject_ReceiveFromServer"/>
    /// </summary>
    [DataContract]
    public class FinalizedUpdateObject_SendToServer : BaseMessage
    {
        [DataMember]
        public FlowTObject flowObject { get; set; }
        [DataMember]
        public FlowUser flowUser { get; set; }
        [DataMember]
        public string projectId { get; set; }

        public FinalizedUpdateObject_SendToServer(FlowTObject flowObject, FlowUser flowUser, string projectId)
        {
            this.flowObject = flowObject;
            this.flowUser = flowUser;
            this.projectId = projectId;
        }
    }
}
