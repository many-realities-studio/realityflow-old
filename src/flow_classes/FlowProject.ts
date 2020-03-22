export class FlowProject{
    public _id: any;
    public description: string;
    public created: number;
    public dateModified: number;
    public projectName: string;

    constructor(json:any){
        this._id = json._id
        this.description = json.description;
        this.created = json.description;
        this.projectName = json.projectName;
    }
}