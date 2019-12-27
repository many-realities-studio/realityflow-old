import { FlowObject } from "./FlowObject";
import { Promise } from "mongoose";


// NOTE: FAM Stands for Fast Access Memory
export class FlowProject{
  private _ObjectList: Array<FlowObject> = [];
  
  // Used for identification in the FAM
  public id;
  
  /**
   * Adds an object to a project
   * @param objectToAdd The object which should be added to the project
   */
  public AddObject(objectToAdd: FlowObject) 
  {
    this._ObjectList.push(objectToAdd);
  }

  /**
   * Removes an object from the list of available objects and returns the object removed
   * Also deletes object from the database
   * @param objectToRemove 
   */
  public DeleteObject(objectToRemove: FlowObject): FlowObject
  {
    const index = this._ObjectList.findIndex((element) => element.id == objectToRemove.id);

    if(index > -1)
    {
      return this._ObjectList.splice(index, 1)[0];
    }

    else return null;
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
   * Deletes the project and all its objects from both FAM and the database
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
    console.error("Not implemented: DeleteFromDatabase in FlowProject.ts");
    
  }

  // TODO: Implement function
  public SaveToDatabase()
  {
    console.error("Not implemented: SaveToDatabase in FlowProject.ts");
  }
}