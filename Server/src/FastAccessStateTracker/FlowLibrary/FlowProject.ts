import { FlowObject } from "./FlowObject";
import { FlowBehaviour } from "./FlowBehaviour";
import { FlowVSGraph } from "./FlowVSGraph";
import { FlowNodeView } from "./FlowNodeView";
import { FlowAvatar } from "./FlowAvatar";

export class FlowProject 
{
  // TODO: this is temporarily public for convenience.
  public _ObjectList: Array<FlowObject> = [];
  //TODO: list of FlowBehaviours
  public _BehaviourList: Array<FlowBehaviour> = [];
  // TODO: list of VSGraphs
  public _VSGraphList: Array<FlowVSGraph> = [];

  public _NodeViewList: Array<FlowNodeView> = [];
  public _AvatarList: Array<FlowAvatar> = [];
  
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
  
  /**
   * Adds an Avatar to a project, saving it to both FAM and the database
   * @param AvatarToAdd The Avatar which should be added to the project
   */
    public AddAvatar(AvatarToAdd: FlowAvatar) 
    {
      this._AvatarList.push(AvatarToAdd);
      return true;
    }
  
    /**
    * Removes an Avatar from the list of available Avatars
    * @param AvatarToRemove 
    */
    public DeleteAvatar(AvatarToRemove: string, client: string) 
    {
      let index = this._AvatarList.findIndex((element) => element.Id == AvatarToRemove);
      if(index > -1 /*&& this._AvatarList[index].CurrentCheckout == client*/){
        this._AvatarList.splice(index);
        return true;
      }
      else return false
    }
  
    /**
    * Returns FlowAvatar with the given ID number 
    * @param AvatarId 
    */
    public GetAvatar(AvatarId: string) : FlowAvatar
    {
      return this._AvatarList.find(element => element.Id == AvatarId);
    }


    /**
    * Returns _AvatarList
    */
    public GetAvatarList() : FlowAvatar[]
    {
      return this._AvatarList;
    }

  //  /**
  //   * sets an Avatar to "checked out," preventing another user from checking out/editing that Avatar
  //   * @param AvatarId 
  //   * @param userName 
  //   * @param client 
  //   */
  //  public CheckoutAvatar(AvatarId: string, client: string){
  //    let obj = this._AvatarList.find(element => element.Id == AvatarId);
      
  //    if (obj != undefined && obj.CurrentCheckout == null){
  //      this._AvatarList.find(element => element.Id == AvatarId).CurrentCheckout = client;
  //      return true
  //    }
      
  //    else return false
  //  }
  
  
  //  /**
  //   * sets an Avatar to "checked in," preventing another user from checking out/editing that Avatar
  //   * @param AvatarId 
  //   */
  //  public CheckinAvatar(AvatarId: string, client){
  //    let obj = this._AvatarList.find(element => element.Id == AvatarId);
  //    if(obj != undefined && obj.CurrentCheckout == client){
  //      obj.CurrentCheckout = null;
  //      return true;
  //    }
  //    else return false;
  //  }
  
    //  We dont need this! /**
    // * find out who has checked out the Avatar in question
    // * @param AvatarId 
    // */
    // public GetAvatarHolder(AvatarId: string){
    //   return this._AvatarList.find(element => element.Id == AvatarId).CurrentCheckout
    // }
  
    /**
    * Updates the Avatar in the FAM without saving to the database
    * @param newAvatar 
    */
    public UpdateFAMAvatar(newAvatar: FlowAvatar, client: string) 
    {
      // Get the Avatar that we are changing from the specified project
      var oldAvatar: FlowAvatar = this._AvatarList.find(element => element.Id == newAvatar.Id);
      if(oldAvatar != undefined /*&& oldAvatar.CurrentCheckout == client*/){
        oldAvatar.UpdateProperties(newAvatar);
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
    if(index > -1 /*&& this._VSGraphList[index].CurrentCheckout == client*/){
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
   * sets a nodeview to "checked out," preventing another user from checking out/editing that nodeview
   * TODO: This will need to be modified as graphs themselves are not going to be checked out. Individual nodes are.
   * @param nodeGUID 
   * @param userName 
   * @param client 
   */
   public CheckoutNodeView(flowNodeView: FlowNodeView, client: string){
    // A NodeView is first added to the project's NodeView list so that it can be managed. Multiple of the same NodeView should not be possible,
    // because another user should fail to send a checkout for an already checked out NodeView to begin with.
    this._NodeViewList.push(flowNodeView);
    let nv = this._NodeViewList.find(element => element.NodeGUID == flowNodeView.NodeGUID);
    
    if (nv != undefined && nv.CurrentCheckout == null){
      this._NodeViewList.find(element => element.NodeGUID == flowNodeView.NodeGUID).CurrentCheckout = client;
      return true
    }
    
    else return false
  }

  /**
   * sets a nodeview to "checked in," preventing another user from checking out/editing that nodeview
   * @param nodeGUID
   */
  public CheckinNodeView(nodeGUID: string, client){
    let nv = this._NodeViewList.find(element => element.NodeGUID == nodeGUID);
    if(nv != undefined && nv.CurrentCheckout == client){
      nv.CurrentCheckout = null;
      
      // Delete the NodeView from the project's NodeView list again. NodeViews exist on the server side temporarily to handle checking them out/in.
      let index = this._NodeViewList.findIndex((element) => element.NodeGUID == nodeGUID);
      if(index > -1 ) { // && this._NodeViewList[index].CurrentCheckout == client){
        this._NodeViewList.splice(index);
      }

      return true;
    }
    else return false;
  }

  /**
   * Updates the graph in the FAM without saving to the database
   * @param newVSGraph 
   */
  public UpdateFAMVSGraph(newVSGraph: FlowVSGraph, client: string) 
  {
    // Get the graph that we are changing from the specified project
    var oldVSGraph: FlowVSGraph = this._VSGraphList.find(element => element.Id == newVSGraph.Id);
    if(oldVSGraph != undefined /*&& oldVSGraph.CurrentCheckout == client*/){
      oldVSGraph.UpdateProperties(newVSGraph);
      return true;
    }
    else return false;
  }

  /**
   * Returns FlowNodeView with the given ID number 
   * @param nodeGUID
   */
   public GetNodeView(nodeGUID: string) : FlowNodeView
   {
     return this._NodeViewList.find(element => element.NodeGUID == nodeGUID);
   }

   /**
   * Updates the nodeview in the FAM without saving to the database
   * @param newNodeView 
   */
  public UpdateFAMNodeView(newNodeView: FlowNodeView, client: string) 
  {
    // Get the nodeview that we are changing from the specified project
    var oldNodeView: FlowNodeView = this._NodeViewList.find(element => element.NodeGUID== newNodeView.NodeGUID);
    if(oldNodeView != undefined && oldNodeView.CurrentCheckout == client){
      oldNodeView.UpdateProperties(newNodeView);
      return true;
    }
    else return false;
  }
}