
export class Action{

    ActionId: string;
    ActionType: string;
    ActionParameters: any;

    constructor(data: any) {
        this.ActionId = data.ActionId;
        this.ActionType = data.ActionType;
        this.ActionParameters = data.Parameters; 
    }
}