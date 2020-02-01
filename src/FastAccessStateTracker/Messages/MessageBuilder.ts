import { IStringable } from "../FlowLibrary/IStringable";

export class MessageBuilder
{
  
  public CreateMessage(...param : IStringable[]) : string
  {
    let stringArray = param.map(function(currentVal) {
      return currentVal.ToString();
    });
    
    return stringArray.reduce( function(previousVal, currentVal) {
      return previousVal + "\n" + currentVal;
    });
  }

  public SuccessMessage() : string
  {
    return "Message successful";
  }

  public FailureMessage() : string
  {
    return "Message failed";
  }
}