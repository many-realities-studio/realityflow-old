import { Color } from "./Color";

export class FlowObject{
  type:           String;
  name:           String;
  triangles:      [];
  x:              Number;
  y:              Number;
  z:              Number;
  q_x:            Number;
  q_y:            Number;
  q_z:            Number;
  q_w:            Number;
  s_x:            Number;
  s_y:            Number;
  s_z:            Number;
  color:          Color;
  vertices:       [];
  uv:             [];
  texture:        [];
  textureHeight:  Number;
  textureWidth:   Number;
  textureFormat:  Number;
  mipmapCount:    Number;
  locked:         Boolean;

  id: number; // Added so that we can search for objects in FAM (Fast access memory)

  /**
   * Saves the current state to the database
   */
  public SaveToDatabase()
  {
    console.error("Not implemented: SaveToDatabase in FlowObject.ts");
  }

  /**
   * Deletes the current instance to the database
   */
  public DeleteFromDatabase()
  {
    console.error("Not implemented: DeleteFromDatabase in FlowObject.ts");
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