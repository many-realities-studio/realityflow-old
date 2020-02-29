import { FlowObject } from "./FlowObject";




// NOTE: FAM Stands for Fast Access Memory
export class FlowProject 
{
  private _ObjectList: Array<FlowObject> = [];
  
  // Used for identification in the FAM
  
  // Data storage fields
  public Id: string;
  public Description: string;
  public DateModified: Number;
  public ProjectName: string;
 
  constructor(json:any){
    this.Id = json.Id
    this.Description = json.Description;
    this.DateModified = json.DateModified;
    this.ProjectName = json.ProjectName;
}

  /**
   * Adds an object to a project, saving it to both FAM and the database
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
  public DeleteObject(objectToRemove: FlowObject): void
  {
    const index = this._ObjectList.findIndex((element) => element.Id == objectToRemove.Id);

  }

  /**
   * Returns FlowObject with the given ID number 
   * @param objectId 
   */
  public GetObject(objectId: string) : FlowObject
  {
    return this._ObjectList.find(element => element.Id == objectId);
  }


  /**
   * Creates an object and attaches it to the desired project in both the FAM and the Database
   * @param objectToCreate 
   */
  public CreateObject(objectToCreate: FlowObject) : void
  {
    // Save for fast access
    this.AddObject(objectToCreate);
    
  }

  /**
   * Updates the object in the FAM without saving to the database
   * @param newObject 
   */
  public UpdateFAMObject(newObject: FlowObject) : void
  {
    // Get the object that we are changing from the specified project
    var oldObject: FlowObject = this.GetObject(newObject.Id);

    // Update all properties of the old object to the new object.
    oldObject.UpdateProperties(newObject);

  }

  // TODO: Find out what this does (or needs to do)
  public static OpenProject(projectToOpen: FlowProject) : void
  {
    throw new Error("Method not implemented.");
  }
}