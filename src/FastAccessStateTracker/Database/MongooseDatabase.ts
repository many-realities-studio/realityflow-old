import { IDatabase } from "./IDatabase";
import { FlowProject } from "../FlowLibrary/FlowProject";
import { FlowUser } from "../FlowLibrary/FlowUser";
import { FlowObject } from "../FlowLibrary/FlowObject";
import {Project, IProjectModel} from "../../models/project";
import {User, IUserModel} from "../../models/User";

// DB API


/**
 * Implementation of Mongoose Database
 */
export class MongooseDatabase implements IDatabase
{
  CreateProject(projectToCreate: FlowProject): boolean {
    
    var success = false;

    //object list will be null upon creation of project
    var newProject = new Project({
      ProjectName: projectToCreate.ProjectName,
      Id: projectToCreate.Id,
      Description: projectToCreate.Description,
      dateModified: projectToCreate.DateModified,
    })

    var promise = newProject.save();

    promise.then(function(doc){
      success = true;
    });

    return success;
    
  }
  DeleteProject(projectToDelete: FlowProject): boolean {
    console.log("deleting project " + projectToDelete.Id);
    Project.findByIdAndRemove({_id: projectToDelete.Id}, function(err, doc){
        if(err)
            console.log(err)
    });
    return true;
  }
  UpdateProject(projectToUpdate: FlowProject): boolean {
    throw new Error("Method not implemented.");
  }
  GetProject(projectId: number): FlowProject {
    throw new Error("Method not implemented.");
  }
  CreateUser(userToCreate: FlowUser): boolean {
    var success = false;

    //object list will be null upon creation of project
    var newUser = new User({
      Username: userToCreate.Username,
      Password: userToCreate.Password,
      Clients: userToCreate.Clients,
      Projects: userToCreate.Projects,
    })

    var promise = newUser.save();

    promise.then(function(doc){
      success = true;
    });

    return success;
  }
  DeleteUser(userToDelete: FlowUser): boolean {
    console.log("attempting to delete user " + userToDelete.Id)
    User.findByIdAndRemove({_id: userToDelete.Id}, function(err, doc){
        if(err){
            console.log(err);
        }
    });
  }
  UpdateUser(userToUpdate: FlowUser): boolean {
    throw new Error("Method not implemented.");
  }
  GetUser(UserId: number): FlowUser {
    throw new Error("Method not implemented.");
  }
  CreateObject(objectToCreate: FlowObject): boolean {
    throw new Error("Method not implemented.");
  }
  DeleteObject(objectToDelete: FlowObject): boolean {
    throw new Error("Method not implemented.");
  }
  UpdateObject(objectToUpdate: FlowObject): boolean {
    throw new Error("Method not implemented.");
  }
  GetObject(ObjectId: number): FlowObject {
    throw new Error("Method not implemented.");
  }
  private _URL: string;

  constructor(url : string)
  {
    this._URL = url;
  }

}