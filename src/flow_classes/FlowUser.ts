// something to note: I noticed that the client is sending the server a lot of data that
// the server simply throws away. We should definitely check that out.



export class FlowUser{
    public _id: any;
    public username: string;
    public password: string;
    public clients: Array<string>;
    public activeProject: string;
    public projects: Array<string>;
    public friends: Array<string>;

    constructor(json:any){
        this.username = json.username;
        this.password = json.password;
    }
}