import { Color } from "./Color";

export class FlowVSGraph
{
  // Data the FlowVSGraph stores
  public Name:           string;
  public X:              Number;
  public Y:              Number;
  public Z:              Number;
  public Q_x:            Number;
  public Q_y:            Number;
  public Q_z:            Number;
  public Q_w:            Number;
  public S_x:            Number; // TODO: Will graph scale be handled as well?
  public S_y:            Number;
  public S_z:            Number;
//   public R:              Number;
//   public G:              Number;
//   public B:              Number;
//   public A:              Number;
//   public Prefab:         string;

  // Fields used for tracking this graph in the FAM

  // Graphs will highly likely use the following fields:
  public Id: string; 
  public RoomNumber: number;
  public CurrentCheckout: string; // TODO: Entire graphs are not checked out/in, nodes are, but for now the graph itself can be

  constructor(json: any)
  {    
    this.Id = json.Id;
    this.Name = json.Name;
    this.X = json.X;
    this.Y = json.Y;
    this.Z = json.Z;
    this.Q_x = json.Q_x;
    this.Q_y = json.Q_y;
    this.Q_z = json.Q_z;
    this.Q_w = json.Q_w;
    this.S_x = json.S_x;
    this.S_y = json.S_y;
    this.S_z = json.S_z;
    // this.R = json.R;
    // this.G = json.G;
    // this.B = json.B;
    // this.A = json.A;
    // this.Prefab = json.Prefab;
    this.CurrentCheckout = null;
}

  /**
   * Updates the properties of this graph with that of the passed in flowVSGraph
   * @param newVSGraph the graph with the properties that should be copied
   */
  public UpdateProperties(newVSGraph: FlowVSGraph)
  {    
    this.Name = newVSGraph.Name;
    this.X = newVSGraph.X;
    this.Y = newVSGraph.Y;
    this.Z = newVSGraph.Z;
    this.Q_x = newVSGraph.Q_x;
    this.Q_y = newVSGraph.Q_y;
    this.Q_z = newVSGraph.Q_z;
    this.Q_w = newVSGraph.Q_w;
    this.S_x = newVSGraph.S_x;
    this.S_y = newVSGraph.S_y;
    this.S_z = newVSGraph.S_z;
    // this.Prefab = newVSGraph.Prefab;
  }
}