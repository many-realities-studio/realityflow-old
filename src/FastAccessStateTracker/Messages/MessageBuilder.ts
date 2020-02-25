import { IStringable } from "../FlowLibrary/IStringable";

export class MessageBuilder
{
  
  public static CreateMessage(...param : any) : string
  {
    let stringArray = param.map(function(currentVal: any) {
      return currentVal.toString();
    });
    
    return stringArray.reduce( function(previousVal: any, currentVal: any) {
      return previousVal + "\n" + currentVal;
    });
  }

  public static SuccessMessage(operation: string) : string
  {
    return operation + " was successful";
  }

  public static FailureMessage(operation: string) : string
  {
    return operation + " was a failure";
  }
}