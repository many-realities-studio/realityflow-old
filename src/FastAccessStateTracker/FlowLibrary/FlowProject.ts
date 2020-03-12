import { FlowObject } from "./FlowObject";
import { FlowBehavior } from "./FlowBehavior";

export class FlowProject 
{
  // TODO: this is temporarily public for convenience.
  public _ObjectList: Array<FlowObject> = [];
  //TODO: list of FlowBehaviors
  public _BehaviorList: Array<FlowBehavior> = [];
  
  // Used for identification in the FAM
  
  // Data storage fields
  public Id: string;
  public Description: string;
  public DateModified: Number;
  public ProjectName: string;
 
  constructor(json:any){
    this.Id = json.Id;
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
   * Removes an object from the list of available objects
   * @param objectToRemove 
   */
  public DeleteObject(objectToRemove: string): void
  {
    const index = this._ObjectList.findIndex((element) => element.Id == objectToRemove);
    this._ObjectList.splice(index)
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
   * sets an object to "checked out," preventing another user from checking out/editing that object
   * @param objectId 
   * @param userName 
   * @param client 
   */
  public CheckoutObject(objectId: string, client: string){
    this._ObjectList.find(element => element.Id == objectId).currentCheckout = client;
  }


  /**
   * sets an object to "checked in," preventing another user from checking out/editing that object
   * @param objectId 
   */
  public CheckinObject(objectId: string){
    this._ObjectList.find(element => element.Id == objectId).currentCheckout = null;
  }

    /**
   * find out who has checked out the object in question
   * @param objectId 
   */
  public GetObjectHolder(objectId: string){
    return this._ObjectList.find(element => element.Id == objectId).currentCheckout
  }

  /**
   * Updates the object in the FAM without saving to the database
   * @param newObject 
   */
  public UpdateFAMObject(newObject: FlowObject) : void
  {
    console.log("object list is " + this._ObjectList)
    console.log("Object Id is " + newObject.Id)
    // Get the object that we are changing from the specified project
    var oldObject: FlowObject = this.GetObject(newObject.Id);

    // Update all properties of the old object to the new object.
    oldObject.UpdateProperties(newObject);

  }

  /**
   * Adds behavior to project list for reference 
   * @param behaviorToAdd The behavior to add to the project
   */
  public AddBehavior(behaviorToAdd: FlowBehavior)
  {
    this._BehaviorList.push(behaviorToAdd);
  }

  /**
   * Delete's behavior from project
   * @param behaviorToRemove the ID of the behavior to be removed from the project
   */
  public DeleteBehavior(behaviorToRemove: string): void
  {
    const index = this._BehaviorList.findIndex((element) => element.Id == behaviorToRemove);
    this._BehaviorList.splice(index)
  }

  /**
   * Updates behaviors
   * @param newBehavior new behavior whose properties to transfer over
   */
  public UpdateBehavior(newBehavior: FlowBehavior) : void
  {
    console.log("behavior list is " + this._BehaviorList)
    console.log("behavior Id is " + newBehavior.Id)
    // Get the behavior that we are changing from the specified project
    var oldBehavior: FlowBehavior = this.GetBehavior(newBehavior.Id);

    // Update all properties of the old behavior to the new behavior.
    oldBehavior.UpdateProperties(newBehavior);

  }

  /**
   * Retrieves Flow Behavior
   * @param behaviorId ID of behavior to get
   */
  public GetBehavior(behaviorId: string) : FlowBehavior
  {
    return this._BehaviorList.find(element => element.Id == behaviorId);
  }

  // TODO: Find out what this does (or needs to do)
  public static OpenProject(projectToOpen: FlowProject) : void
  {
    throw new Error("Method not implemented.");
  }
}