using RealityFlow.Plugin.Scripts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;

namespace Packages.realityflow_package.Runtime.scripts.Messages.ProjectMessages
{
    /// <summary>
    /// Create project request message format 
    /// Receive: <see cref="CreateProject_Received"/>
    /// </summary>
    [DataContract]
    public class CreateProject_SendToServer : BaseMessage
    {
        [DataMember]
        FlowProject flowProject { get; set; }
        [DataMember]
        FlowUser flowUser { get; set; }

        public CreateProject_SendToServer(FlowProject flowProject, FlowUser flowUser)
        {
            this.flowProject = flowProject;
            this.flowUser = flowUser;
        }
    }

    /// <summary>
    /// Delete project request message format 
    /// Receive: <see cref="DeleteProject_Received"/>
    /// </summary>
    [DataContract]
    public class DeleteProject_SendToServer : BaseMessage
    {
        [DataMember]
        FlowProject flowProject { get; set; }
        [DataMember]
        FlowUser flowUser { get; set; }

        public DeleteProject_SendToServer(FlowProject flowProject, FlowUser flowUser)
        {
            this.flowProject = flowProject;
            this.flowUser = flowUser;
        }
    }

    /// <summary>
    /// Open project request message format 
    /// <see cref="OpenProject_Received"/>
    /// </summary>
    [DataContract]
    public class OpenProject_SendToServer : BaseMessage
    {
        [DataMember]
        string projectId { get; set; }
        [DataMember]
        FlowUser flowUser { get; set; }

        public OpenProject_SendToServer(string projectId, FlowUser flowUser)
        {
            this.projectId = projectId;
            this.flowUser = flowUser;
        }
    }

    /// <summary>
    /// Message format to request a list of all projects that the user has 
    /// <see cref="GetAllUserProjects_Received"/>
    /// </summary>
    [DataContract]
    public class GetAllUserProjects_SendToServer : BaseMessage
    {
        [DataMember]
        FlowUser flowUser { get; set; }

        public GetAllUserProjects_SendToServer(FlowUser flowUser)
        {
            this.flowUser = flowUser;
        }
    }
}
