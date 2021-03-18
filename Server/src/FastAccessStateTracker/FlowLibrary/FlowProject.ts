import { FlowObject } from "./FlowObject";
import { FlowBehaviour } from "./FlowBehaviour";
import { FlowVSGraph } from "./FlowVSGraph";

export class FlowProject 
{
  // TODO: this is temporarily public for convenience.
  public _ObjectList: Array<FlowObject> = [];
  //TODO: list of FlowBehaviours
  public _BehaviourList: Array<FlowBehaviour> = [];
  // TODO: list of VSGraphs
  public _VSGraphList: Array<FlowVSGraph> = [];
  
  // Used for identification in the FAM
  
  // Data storage fields
  public Id: string;
  public Description: string;
  public DateModified: number;
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

  public UpdateBehaviour(newBehaviour: FlowBehaviour, client: string) 
  {
    // Get the Behaviour that we are changing from the specified project
    var oldBehaviour: FlowBehaviour = this._BehaviourList.find(element => element.Id == newBehaviour.Id);
    if(oldBehaviour != undefined){
      oldBehaviour.UpdateProperties(newBehaviour);
      return true;
    }
    else return false;
  }

  /**
   * Adds Behaviour to project list for reference 
   * @param BehaviourToAdd The Behaviour to add to the project
   */
  public AddBehaviour(BehaviourToAdd: FlowBehaviour)
  {
    this._BehaviourList.push(BehaviourToAdd);
  }

  /**
   * Delete's Behaviour from project
   * @param BehaviourToRemove the ID of the Behaviour to be removed from the project
   */
  public DeleteBehaviour(BehaviourToRemove: Array<string>): Boolean
  {
    this._BehaviourList = this._BehaviourList.filter((behaviour, index, arr) => BehaviourToRemove.indexOf(behaviour.Id) == -1)
    return true
  }

  /**
   * Retrieves Flow Behaviour
   * @param BehaviourId ID of Behaviour to get
   */
  public GetBehaviour(BehaviourId: string) : FlowBehaviour
  {
    return this._BehaviourList.find(element => element.Id == BehaviourId);
  }

  // TODO: Find out what this does (or needs to do)
  public static OpenProject(projectToOpen: FlowProject) : void
  {
    throw new Error("Method not implemented.");
  }

  // Visual Scripting Graph project functions

  /**
   * Adds a graph to a project, saving it to both FAM and the database
   * @param vsGraphToAdd The graph which should be added to the project
   */
  public AddVSGraph(vsGraphToAdd: FlowVSGraph) 
  {
    this._VSGraphList.push(vsGraphToAdd);
    return true;
  }

  /**
   * Removes a graph from the list of available graphs
   * @param vsGraphToRemove 
   */
  public DeleteVSGraph(vsGraphToRemove: string, client: string) 
  {
    let index = this._VSGraphList.findIndex((element) => element.Id == vsGraphToRemove);
    if(index > -1 && this._VSGraphList[index].CurrentCheckout == client){
      this._VSGraphList.splice(index);
      return true;
    }
    else return false
  }

  /**
   * Returns FlowVSGraph with the given ID number 
   * @param vsGraphId 
   */
  public GetVSGraph(vsGraphId: string) : FlowVSGraph
  {
    return this._VSGraphList.find(element => element.Id == vsGraphId);
  }

  /**
   * sets a graph to "checked out," preventing another user from checking out/editing that graph
   * TODO: This will need to be modified as graphs themselves are not going to be checked out. Individual nodes are.
   * @param vsGraphId 
   * @param userName 
   * @param client 
   */
  public CheckoutVSGraph(vsGraphId: string, client: string){
    let grph = this._VSGraphList.find(element => element.Id == vsGraphId);
    
    if (grph != undefined && grph.CurrentCheckout == null){
      this._VSGraphList.find(element => element.Id == vsGraphId).CurrentCheckout = client;
      return true
    }
    
    else return false
  }

  /**
   * sets an graph to "checked in," preventing another user from checking out/editing that graph
   * @param vsGraphId 
   */
  public CheckinVSGraph(vsGraphId: string, client){
    let grph = this._VSGraphList.find(element => element.Id == vsGraphId);
    if(grph != undefined && grph.CurrentCheckout == client){
      grph.CurrentCheckout = null;
      return true;
    }
    else return false;
  }

    /**
   * find out who has checked out the graph in question
   * @param vsGraphId 
   */
  public GetVSGraphHolder(vsGraphId: string){
    return this._VSGraphList.find(element => element.Id == vsGraphId).CurrentCheckout
  }

  /**
   * Updates the graph in the FAM without saving to the database
   * @param newVSGraph 
   */
  public UpdateFAMVSGraph(newVSGraph: FlowVSGraph, client: string) 
  {
    // Get the graph that we are changing from the specified project
    var oldVSGraph: FlowVSGraph = this._VSGraphList.find(element => element.Id == newVSGraph.Id);
    if(oldVSGraph != undefined && oldVSGraph.CurrentCheckout == client){
      oldVSGraph.UpdateProperties(newVSGraph);
      return true;
    }
    else return false;
  }
}