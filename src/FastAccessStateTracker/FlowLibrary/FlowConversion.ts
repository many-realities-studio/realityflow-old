import { FlowUser } from "./FlowUser";
import { FlowObject } from "./FlowObject";
import { FlowProject } from "./FlowProject";

/**
 * Converts data received from a JSON into its respective Flow type
 */
export class FlowConversion
{
  /**
   * Converts data received from a JSON and converts it into a FlowUser
   * @param data 
   */
  public static ConvertToFlowUser(data: any) : FlowUser
  {
    throw new Error("Method not implemented.");
  }

  /**
   * Converts data received from a JSON and converts it into a FlowObject
   * @param data 
   */
  public static ConvertToFlowObject(data: any) : FlowObject
  {
    throw new Error("Method not implemented.");
  }

  /**
   * Converts data received from a JSON and converts it into a FlowProject
   * @param data 
   */
  public static ConvertToFlowProject(data: any) : FlowProject
  {
    throw new Error("Method not implemented.");
  }
}