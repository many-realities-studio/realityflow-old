import { Color } from "./Color";
import { IStringable } from "./IStringable";

export class FlowObject implements IStringable
{
  // Data the FlowObject stores
  public Type:           string;
  public Name:           string;
  public Triangles:      [];
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
  public Uv:             [];
  public Texture:        [];
  public TextureHeight:  Number;
  public TextureWidth:   Number;
  public TextureFormat:  Number;
  public MipmapCount:    Number;
  public Locked:         Boolean;

  // Fields used for tracking this object in the FAM
  public id: number; 
  public RoomNumber: number;

  constructor(json: any)
  {    
    this.Type = json.Type;
    this.Name = json.Name;
    this.Triangles = json.Triangles;
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
    this.Uv = json.Uv;
    this.Texture = json.Texture;
    this.TextureHeight = json.TextureHeight;
    this.TextureWidth = json.TextureWidth;
    this.TextureFormat = json.TextureFormat;
    this.MipmapCount = json.MipmapCount;
}

  /**
   * Converts this instance of a FlowObject into a string.
   */
  ToString() : string {
    throw new Error("Method not implemented.");
  }

  /**
   * Saves the current state to the database
   */
  public SaveToDatabase()
  {
    throw new Error("Method not implemented.");
  }

  /**
   * Deletes the current instance to the database
   */
  public DeleteFromDatabase()
  {
    throw new Error("Method not implemented.");
  }

  /**
   * Updates the properties of this object with that of the passed in flowObject
   * @param newObject the object with the properties that should be copied
   */
  public UpdateProperties(newObject: FlowObject)
  {
    this.Type = newObject.Type;          
    this.Name = newObject.Name;
    this.Triangles = newObject.Triangles
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
    this.color = newObject.color;
    this.vertices = newObject.vertices;
    this.Uv = newObject.Uv;
    this.Texture = newObject.Texture;
    this.TextureHeight = newObject.TextureHeight;
    this.TextureWidth = newObject.TextureWidth;
    this.TextureFormat = newObject.TextureFormat;
    this.MipmapCount = newObject.MipmapCount;
    this.Locked = newObject.Locked;
  }
}