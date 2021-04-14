import { Color } from "./Color";

export class FlowAvatar
{
  // Data the FlowAvatar stores
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
  // public Prefab:         string;

  // Fields used for tracking this Avatar in the FAM
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
    // this.Prefab = json.Prefab;
    //this.CurrentCheckout = null;
}

  /**
   * Updates the properties of this Avatar with that of the passed in flowAvatar
   * @param newAvatar the Avatar with the properties that should be copied
   */
  public UpdateProperties(newAvatar: FlowAvatar)
  {    
    this.Name = newAvatar.Name;
    this.X = newAvatar.X;
    this.Y = newAvatar.Y;
    this.Z = newAvatar.Z;
    this.Q_x = newAvatar.Q_x;
    this.Q_y = newAvatar.Q_y;
    this.Q_z = newAvatar.Q_z;
    this.Q_w = newAvatar.Q_w;
    this.S_x = newAvatar.S_x;
    this.S_y = newAvatar.S_y;
    this.S_z = newAvatar.S_z;
    // this.Prefab = newAvatar.Prefab;
  }
}