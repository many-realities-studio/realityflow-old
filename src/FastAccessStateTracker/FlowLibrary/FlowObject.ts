import { Color } from "./Color";
import { IConvertToJson } from "./IConvertToJson";

export class FlowObject implements IConvertToJson
{
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

  public id: number; // Added so that we can search for objects in FAM (Fast access memory)
  public RoomNumber: number;

  ConvertToJson(): JSON {
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