import { Color } from "./Color";
import { IStringable } from "./IStringable";

export class FlowObject implements IStringable
{
  // Data the FlowObject stores
  public type:           string;
  public name:           string;
  public triangles:      [];
  public x:              Number;
  public y:              Number;
  public z:              Number;
  public q_x:            Number;
  public q_y:            Number;
  public q_z:            Number;
  public q_w:            Number;
  public s_x:            Number;
  public s_y:            Number;
  public s_z:            Number;
  public color:          Color;
  public vertices:       [];
  public uv:             [];
  public texture:        [];
  public textureHeight:  Number;
  public textureWidth:   Number;
  public textureFormat:  Number;
  public mipmapCount:    Number;
  public locked:         Boolean;

  // Fields used for tracking this object in the FAM
  public id: number; 
  public RoomNumber: number;

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
    this.type = newObject.type;          
    this.name = newObject.name;
    this.triangles = newObject.triangles
    this.x = newObject.x;
    this.y = newObject.y;
    this.z = newObject.z;
    this.q_x = newObject.q_x;
    this.q_y = newObject.q_y;
    this.q_z = newObject.q_z;
    this.q_w = newObject.q_w;
    this.s_x = newObject.s_x;
    this.s_y = newObject.s_y;
    this.s_z = newObject.s_z;
    this.color = newObject.color;
    this.vertices = newObject.vertices;
    this.uv = newObject.uv;
    this.texture = newObject.texture;
    this.textureHeight = newObject.textureHeight;
    this.textureWidth = newObject.textureWidth;
    this.textureFormat = newObject.textureFormat;
    this.mipmapCount = newObject.mipmapCount;
    this.locked = newObject.locked;
  }
}