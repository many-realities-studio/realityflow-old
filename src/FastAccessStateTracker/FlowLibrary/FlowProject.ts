import { FlowObject } from "./FlowObject";

// For the database
import {Object} from "../../models/object";
import { IConvertToJson } from "./IConvertToJson";

// NOTE: FAM Stands for Fast Access Memory
export class FlowProject implements IConvertToJson
{
  private _ObjectList: Array<FlowObject> = [];
  
  // Used for identification in the FAM
  public id;
 
  ConvertToJson(): JSON {
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

  // TODO: Implement function
  /**
   * Deletes the project reference from the database
   * Note: Does not delete any of the projects dependencies, including objects, textures, etc.
   */
  private DeleteFromDatabase()
  {
    throw new Error("Method not implemented.");
    
  }

  // TODO: Implement function
  public SaveToDatabase()
  {
    throw new Error("Method not implemented.");
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
      type:           objectToCreate.type,
      name:           objectToCreate.name,
      triangles:      objectToCreate.triangles,
      x:              objectToCreate.x,
      y:              objectToCreate.y,
      z:              objectToCreate.z,
      q_x:            objectToCreate.q_x,
      q_y:            objectToCreate.q_y,
      q_z:            objectToCreate.q_z,
      q_w:            objectToCreate.q_w,
      s_x:            objectToCreate.s_x,
      s_y:            objectToCreate.s_y,
      s_z:            objectToCreate.s_z,
      color:          objectToCreate.color,
      vertices:       objectToCreate.vertices,
      uv:             objectToCreate.uv,
      texture:        objectToCreate.texture,
      textureHeight:  objectToCreate.textureHeight,
      textureWidth:   objectToCreate.textureWidth,
      textureFormat:  objectToCreate.textureFormat,
      mipmapCount:    objectToCreate.mipmapCount,
      locked:         objectToCreate.locked
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

  // TODO: Find out what this does (or needs to do)
  public static OpenProject(projectToOpen: FlowProject) : void
  {
    throw new Error("Method not implemented.");
  }
}