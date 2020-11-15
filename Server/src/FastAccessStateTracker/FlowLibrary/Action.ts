
export class Action{

    ActionId: string;
    ActionType: string;
    ActionParameters: any;

    constructor(data: any) {
        if(!data)
            return null;
        this.ActionId = data.ActionId;
        this.ActionType = data.ActionType;
        this.ActionParameters = data.ActionParameters ? data.ActionParameters : {}; 
    }
}