export class FlowNodeView
{
  // Data the FlowNodeView stores
  public LocalPos:           any;
  public NodeGUID:           string;

  // Fields used for tracking this nodeview in the FAM
  // public Id: string; 
  public RoomNumber: number;
  public CurrentCheckout: string;

  constructor(json: any)
  {
    this.LocalPos = json.LocalPos;
    this.NodeGUID = json.NodeGUID;
    this.CurrentCheckout = null;
}

  /**
   * Updates the properties of this object with that of the passed in flowNodeView
   * @param newNodeView the nodeview with the properties that should be copied
   */
  public UpdateProperties(newNodeView: FlowNodeView)
  {    
    this.LocalPos = newNodeView.LocalPos;
    this.NodeGUID = newNodeView.NodeGUID;
    this.CurrentCheckout = null;
  }
}