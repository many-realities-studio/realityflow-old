export class FlowClient{
    public _id:            any;
    public user:           string;
    public deviceType:     number;

    constructor(clientJson: any){

        this.user = clientJson.user._id;
        this.deviceType = clientJson.deviceType;
    }

}