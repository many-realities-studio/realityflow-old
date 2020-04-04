
export class Action{

    ActionId: string;
    ActionType: string;
    ActionParameters: Object;

    constructor(data: any) {
        this.ActionId = data.ActionId;
        this.ActionType = data.ActionType;
        this.ActionParameters = data.Parameters; 
    }
}