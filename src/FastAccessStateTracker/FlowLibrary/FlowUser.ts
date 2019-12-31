import { IConvertToJson } from "./IConvertToJson";

export class FlowUser implements IConvertToJson
{
  // ID used by FAM for unique identification
  public id;
  
  ConvertToJson(): JSON 
  {
    throw new Error("Method not implemented.");
  }

  // TODO: Add implementation
  public AddToDatabase()
  {
    throw new Error("Method not implemented.");
  }

  // TODO: Add implementation
  public Login()
  {
    throw new Error("Method not implemented.");
  }

  // TODO: Add implementation
  public Logout()
  {
    throw new Error("Method not implemented.");
  }

  // TODO: Add implmentation to delete from database
  public Delete()
  {

  }
}