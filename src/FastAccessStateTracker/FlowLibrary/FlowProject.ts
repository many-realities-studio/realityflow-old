import { FlowObject } from "./FlowObject";

// For the database
import {Object} from "../../models/object";
import { IStringable } from "./IStringable";
import { MongooseDatabase } from "../Database/MongooseDatabase"
import { ConfigurationSingleton } from "../ConfigurationSingleton";

// NOTE: FAM Stands for Fast Access Memory
export class FlowProject implements IStringable
{
  private _ObjectList: Array<FlowObject> = [];
  
  // Used for identification in the FAM
  
  // Data storage fields
  public Id;
  public Description: string;
  public DateModified: Date;
  public ProjectName: string;
 
  constructor(json:any){
    this.Id = json.Id
    this.Description = json.Description;
    this.DateModified = json.DateModified;
    this.ProjectName = json.ProjectName;

    // TODO: Save to Database in constructor and generate/attach ID
    // Async measure
}

  ToString(): string {
    throw new Error("Method not implemented.");
  }

  /**
   * Adds an object to a project, saving it to both FAM and the database
   * @param objectToAdd The object which should be added to the project
   */
  public AddObject(objectToAdd: FlowObject) 
  {
    this._ObjectList.push(objectToAdd);
    objectToAdd.SaveToDatabase();
  }

  /**
   * Removes an object from the list of available objects and returns the object removed
   * Also deletes object from the database
   * @param objectToRemove 
   */
  public DeleteObject(objectToRemove: FlowObject): void
  {
    const index = this._ObjectList.findIndex((element) => element.id == objectToRemove.id);

    var DeletedObject : FlowObject = null;
    if(index > -1)
    {
      DeletedObject = this._ObjectList.splice(index, 1)[0];
    }

    // Remove object from database
    if(DeletedObject != null)
    {
      DeletedObject.DeleteFromDatabase();
    }
  }

  /**
   * Returns FlowObject with the given ID number 
   * @param objectId 
   */
  public GetObject(objectId: Number) : FlowObject
  {
    return this._ObjectList.find(element => element.id == objectId);
  }

  /**
   * Deletes the project and all its objects from the database
   */
  public Delete()
  {
    this._ObjectList.forEach((objectToDelete) => {
      objectToDelete.DeleteFromDatabase()
    })

    this.DeleteFromDatabase();
  }

  /**
   * Deletes the project reference from the database
   * Note: Does not delete any of the projects dependencies, including objects, textures, etc.
   */
  private DeleteFromDatabase()
  {
    ConfigurationSingleton.Database.DeleteProject(this);
  }

  public SaveToDatabase()
  {
    ConfigurationSingleton.Database.UpdateProject(this);
  }

  /**
   * Creates an object and attaches it to the desired project in both the FAM and the Database
   * @param objectToCreate 
   */
  public CreateObject(objectToCreate: FlowObject) : void
  {
    // Save for fast access
    this.AddObject(objectToCreate);

    // Async save to database
    var databaseFlowObject = new Object({
      type:           objectToCreate.Type,
      name:           objectToCreate.Name,
      triangles:      objectToCreate.Triangles,
      x:              objectToCreate.X,
      y:              objectToCreate.Y,
      z:              objectToCreate.Z,
      q_x:            objectToCreate.Q_x,
      q_y:            objectToCreate.Q_y,
      q_z:            objectToCreate.Q_z,
      q_w:            objectToCreate.Q_w,
      s_x:            objectToCreate.S_x,
      s_y:            objectToCreate.S_y,
      s_z:            objectToCreate.S_z,
      uv:             objectToCreate.Uv,
      texture:        objectToCreate.Texture,
      textureHeight:  objectToCreate.TextureHeight,
      textureWidth:   objectToCreate.TextureWidth,
      textureFormat:  objectToCreate.TextureFormat,
      mipmapCount:    objectToCreate.MipmapCount,
      locked:         objectToCreate.Locked
    });

    databaseFlowObject.save()
      .then( (doc) => {
          this.SaveToDatabase();
      });
  }

  /**
   * Updates the data of a desired object, first in the FAM and then (asynchronously) to the database
   * @param objectToUpdate 
   */
  public UpdateObject(newObject: FlowObject) : void
  {
    // Get the object that we are changing from the specified project
    var oldObject: FlowObject = this.GetObject(newObject.id);

    // Update all properties of the old object to the new object.
    oldObject.UpdateProperties(newObject);

    // Update the database
    oldObject.SaveToDatabase();
  }

  /**
   * Updates the object in the FAM without saving to the database
   * @param newObject 
   */
  public UpdateFAMObject(newObject: FlowObject) : void
  {
    // Get the object that we are changing from the specified project
    var oldObject: FlowObject = this.GetObject(newObject.id);

    // Update all properties of the old object to the new object.
    oldObject.UpdateProperties(newObject);

  }

  // TODO: Find out what this does (or needs to do)
  public static OpenProject(projectToOpen: FlowProject) : void
  {
    throw new Error("Method not implemented.");
  }
}