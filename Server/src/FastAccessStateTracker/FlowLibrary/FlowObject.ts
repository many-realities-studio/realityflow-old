import { Color } from "./Color";

export class FlowObject
{
  // Data the FlowObject stores
  public Name:           string;
  public X:              Number;
  public Y:              Number;
  public Z:              Number;
  public Q_x:            Number;
  public Q_y:            Number;
  public Q_z:            Number;
  public Q_w:            Number;
  public S_x:            Number;
  public S_y:            Number;
  public S_z:            Number;
  public R:              Number;
  public G:              Number;
  public B:              Number;
  public A:              Number;
  public Prefab:         string;

  // Fields used for tracking this object in the FAM
  public Id: string; 
  public RoomNumber: number;
  public CurrentCheckout: string;

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
    this.R = json.R;
    this.G = json.G;
    this.B = json.B;
    this.A = json.A;
    this.Prefab = json.Prefab;
    this.CurrentCheckout = null;
}

  /**
   * Updates the properties of this object with that of the passed in flowObject
   * @param newObject the object with the properties that should be copied
   */
  public UpdateProperties(newObject: FlowObject)
  {    
    this.Name = newObject.Name;
    this.X = newObject.X;
    this.Y = newObject.Y;
    this.Z = newObject.Z;
    this.Q_x = newObject.Q_x;
    this.Q_y = newObject.Q_y;
    this.Q_z = newObject.Q_z;
    this.Q_w = newObject.Q_w;
    this.S_x = newObject.S_x;
    this.S_y = newObject.S_y;
    this.S_z = newObject.S_z;
    this.Prefab = newObject.Prefab;
  }
}