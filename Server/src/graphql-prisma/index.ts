import { prisma } from "../server"
import { ServerEventDispatcher } from "../server"
import { StateTracker } from "../FastAccessStateTracker/StateTracker"
import { RoomManager } from "../FastAccessStateTracker/RoomManager"
import { FlowObject } from "../FastAccessStateTracker/FlowLibrary/FlowObject"
import { FlowBehaviour } from "../FastAccessStateTracker/FlowLibrary/FlowBehaviour"
import { MessageBuilder } from "../FastAccessStateTracker/Messages/MessageBuilder";
// import { FlowObject } from "../FastAccessStateTracker/FlowLibrary/FlowObject"
// import { FlowVSGraph } from "../FastAccessStateTracker/FlowLibrary/FlowVSGraph"
// import { FlowProject } from "../FastAccessStateTracker/FlowLibrary/FlowProject"


// These re the resolver functions for the queries and mutations described in schema.graphql file.
const resolvers = {
  Query: {
    behaviour: async (parent, args, context) => {
      return context.prisma.behaviour.findMany()
    },

    user: async (parent, args, context) => {
      return context.prisma.user.findMany({ include: { project: { include: { user: true, db_object: true } } } })
    },

    project: async (parent, args, context) => {

      return context.prisma.project.findMany({ include: { user: true, db_object: true } })
    },

    object: async (parent, args, context) => {
      return context.prisma.db_object.findMany({ include: { project: true, user:true } })
    },

  },

  Mutation: {
    createBehaviour: (parent, args, context, info) => {
      const newBehaviour = context.prisma.behaviour.create({
        data: {
          Id: args.Id,
          TypeOfTrigger: args.TypeOfTrigger,
          TriggerObjectId: args.TriggerObjectId,
          TargetObjectId: args.TargetObjectId,
          ProjectId: args.ProjectId,
          NextBehaviour: args.NextBehaviour,
          Action: JSON.stringify(args.Action),
        },
      })
      return newBehaviour
    },

    updateBehaviour: (parent, args, context, info) => {
      const updated_Behaviour = context.prisma.behaviour.update({
        data: {
          TypeOfTrigger: args.TypeOfTrigger,
          TriggerObjectId: args.TriggerObjectId,
          TargetObjectId: args.TargetObjectId,
          ProjectId: args.ProjectId,
          NextBehaviour: args.NextBehaviour,
          Action: args.Action,
        },
        where: { Id: args.Id }
      })
      return updated_Behaviour
    },

    deleteBehaviour: (parent, args, context, info) => {
      const delete_behaviour = context.prisma.behaviour.delete({
        where: { Id: args.Id }
      })
      return delete_behaviour
    },

    createUser: async (_, args, context, __) => {
      console.log(args.input)
      let DateModified = new Date().toISOString();
      const newuser = await context.prisma.user.create({
        include: {
          project: true
        },
        data: {
          Username: args.Username,
          Password: args.Password,
          // project: {
          //   create: [{...args.input[0],DateModified}]
          // }
        },
      })
      return newuser
    },

    updateUser: (parent, args, context, info) => {
      const updated_user = context.prisma.user.update({
        data: {
          Username: args.Username,
          Password: args.Password,
        },
        where: { Username: args.Username }
      })
      return updated_user
    },

    deleteUser: (parent, args, context, info) => {
      const finish = prisma.user.findMany({ 
        include: { 
          project: { 
            include: { 
              user: true, db_object: true 
            } 
          } 
        } 
      })
    },

    createProject: (parent, args, context, info) => {
      const create_project = context.prisma.project.create({
        data: {
          Id: args.Id,
          Description: args.Description,
          ProjectName: args.ProjectName,
          DateModified: new Date().toISOString(),
          ownerUsername: args.ownerUsername
        },
        include: {
          user: true,
          db_object: true
        }
      })
      return create_project
    },

    updateProject: (parent, args, context, info) => {
      const update_project = context.prisma.project.update({
        data: {
          Description: args.Description,
          ProjectName: args.ProjectName,
          DateModified: new Date().toISOString(),
          ownerUsername: args.ownerUsername
        },
        where: { Id: args.Id }
      })
      return update_project
    },

    deleteProject: async (parent, args, context, info) => {
      const deleteProjObj = context.prisma.db_object.deleteMany({
        where: {
          projectId: args.Id,
        }
      })

      const deleteProj = context.prisma.project.delete({
        where: {
          Id: args.Id,
        }
      })

      const [result1, result2] = await prisma.$transaction([deleteProjObj, deleteProj])
      return result2

    },

    createObject: async (_, args, context, __) => {
      const create_object = context.prisma.db_object.create({
        data: {
          Id: args.Id,
          Name: args.Name,
          X: args.X,
          Y: args.Y,
          Z: args.Z,
          Q_x: args.Q_x,
          Q_y: args.Q_y,
          Q_z: args.Q_z,
          Q_w: args.Q_w,
          S_x: args.S_x,
          S_y: args.S_y,
          S_z: args.S_z,
          R: args.R,
          G: args.G,
          B: args.B,
          A: args.A,
          Prefab: args.Prefab,
          projectId: args.projectId,
        },
        include: {
          project: true
        }
      })
      // FAM Access
      FAMaccess(1, args)
      return create_object
    },

    updateObject: async (_, args, context, __) => {
      try{
        var object = await StateTracker.ReadObject(args.Id, args.projectId, args.username)
      }catch(error)
      {
        console.error(error)
        process.exit(1)
      }finally{
          StateTracker.UpdateObject(object[0], args.projectId, "client:none", true, args.username)
          StateTracker.CheckinObject(args.projectId, args.Id, "client:none", args.username)
          const update_object = context.prisma.db_object.update({
          data: {
            Name: object[0].Name,
            X: object[0].X,
            Y: object[0].Y,
            Z: object[0].Z,
            Q_x: object[0].Q_x,
            Q_y: object[0].Q_y,
            Q_z: object[0].Q_z,
            Q_w: object[0].Q_w,
            S_x: object[0].S_x,
            S_y: object[0].S_y,
            S_z: object[0].S_z,
            R: object[0].R,
            G: object[0].G,
            B: object[0].B,
            A: object[0].A,
            Prefab: object[0].Prefab,
            projectId: object[0].projectId,
          },
          where: { Id: object[0].Id }
        })
        return update_object
      }
    },

    deleteObject: async (_, args, context, __) => {
      const delete_object = context.prisma.db_object.delete({
        where: {
          Id: args.Id
        }
      })
      
      // FAM Access
      await FAMaccess(2, args)
      return delete_object
    },


    createVSGraph: (_, args, context, __) =>{
      const create_VSGraph = context.prisma.vs_graph.create({
        data: {
          Name:              args.Name,
          serializedNodes:   args.serializedNodes,
          edges:             args.edges,
          groups:            args.stackNodes,
          stackNodes:        args.stackNodes,
          pinnedElements:    args.pinnedElements,
          exposedParameters: args.exposedParameters,
          stickyNotes:       args.stickyNotes,
          position:          args.position,
          scale:             args.scale,
          references:        args.references,
          projectId:         args.projectId,
          project:           args.project
        },
        include: {
          project: true
        }

      })
      return create_VSGraph;
    },

    updateVSGraph: (_, args, context, __) =>{
      const update_VSGraph = context.prisma.vs_graph.update({
        data: {
          Name:              args.Name,
          serializedNodes:   args.serializedNodes,
          edges:             args.edges,
          groups:            args.stackNodes,
          stackNodes:        args.stackNodes,
          pinnedElements:    args.pinnedElements,
          exposedParameters: args.exposedParameters,
          stickyNotes:       args.stickyNotes,
          position:          args.position,
          scale:             args.scale,
          references:        args.references,
          projectId:         args.projectId,
          project:           args.project
        },
        where: { Id: args.Id }

      })
      return update_VSGraph;
    },

    deleteVSGraph: (_, args, context, __) =>{
      const delete_VSGraph = context.prisma.vs_graph.delete({
        where: {
          Id: args.Id
        }
      })
      return delete_VSGraph
    }


  }
}

// The purpose of this method is to recreate the priming of return data for Unity.
// i.e: The return message type and other info.
async function FAMaccess (FAM : number, args)
{
  switch(FAM) // Choosing which FAM Operation needs to be executed.
  {
    case 1:
      try{
        var argsObj = new FlowObject(args)
        var res1 = await StateTracker.CreateObject(argsObj, args.projectId)
      }catch(error)
      {
        console.error(error)
        process.exit(1)
      }finally{
        let returnContent = {
          "MessageType": "CreateObject",
          "FlowObject": res1[0],
          "WasSuccessful": (res1[0] == null) ? false: true
        }
        let returnMessage = MessageBuilder.CreateMessage(returnContent, res1[1])
        TalkToClients(returnMessage);
      }
      break;

    case 2:
      var res2 = await StateTracker.DeleteObject(args.Id, args.projectId, "none")
      let returnContent = {
        "MessageType": "DeleteObject",
        "ObjectId": res2[0],
        "WasSuccessful": (res2[0] == null) ? false: true,
      }
      let returnMessage = MessageBuilder.CreateMessage(returnContent, res2[1])
  
      TalkToClients(returnMessage)
      break;

      // case 3: 
      // The next cases and changes that have to do with vs_graphs are buggy and incomplete
      // They can be found in the FaisalCleanUp branch
      // break;
  }
}


// Since we dont have the ability to tweek what response going back to Unity from the initial HTTP request
// made to get here(inside the Apollo server) then using the list of websocketId's and helpfer methods used in server.ts
// we can send out the changes to the appropriate users from this file.
 function TalkToClients(res: any){
  console.log("We made it from GraphQL!")
  let clients = res[1];

  if(!clients)
  {
      console.log("Didn't receive a clients array [We're in Apollo]");
  }
  else
  {
      for(var i = 0; i < clients.length; i++)
      {
          let key = clients[i];
          ServerEventDispatcher.SocketConnections.get(key).send(res[0]);
      }
  }
}

module.exports = {resolvers}