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
    return true;
  }

  /**
   * Removes an object from the list of available objects
   * @param objectToRemove 
   */
  public DeleteObject(objectToRemove: string, client: string) 
  {
    let index = this._ObjectList.findIndex((element) => element.Id == objectToRemove);
    if(index > -1 && this._ObjectList[index].CurrentCheckout == client){
      this._ObjectList.splice(index);
      return true;
    }
    else return false
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
   * sets an object to "checked out," preventing another user from checking out/editing that object
   * @param objectId 
   * @param userName 
   * @param client 
   */
  public CheckoutObject(objectId: string, client: string){
    let obj = this._ObjectList.find(element => element.Id == objectId);
    
    if (obj != undefined && obj.CurrentCheckout == null){
      this._ObjectList.find(element => element.Id == objectId).CurrentCheckout = client;
      return true
    }
    
    else return false
  }


  /**
   * sets an object to "checked in," preventing another user from checking out/editing that object
   * @param objectId 
   */
  public CheckinObject(objectId: string, client){
    let obj = this._ObjectList.find(element => element.Id == objectId);
    if(obj != undefined && obj.CurrentCheckout == client){
      obj.CurrentCheckout = null;
      return true;
    }
    else return false;
  }

    /**
   * find out who has checked out the object in question
   * @param objectId 
   */
  public GetObjectHolder(objectId: string){
    return this._ObjectList.find(element => element.Id == objectId).CurrentCheckout
  }

  /**
   * Updates the object in the FAM without saving to the database
   * @param newObject 
   */
  public UpdateFAMObject(newObject: FlowObject, client: string) 
  {
    // Get the object that we are changing from the specified project
    var oldObject: FlowObject = this._ObjectList.find(element => element.Id == newObject.Id);
    if(oldObject != undefined && oldObject.CurrentCheckout == client){
      oldObject.UpdateProperties(newObject);
      return true;
    }
    else return false;
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