// something to note: I noticed that the client is sending the server a lot of data that
// the server simply throws away. We should definitely check that out.

export class FlowClient{
    _id:            any;
    user:           string;
    deviceType:     number;

    constructor(clientJson: any){

        this.user = clientJson.user._id;
        this.deviceType = clientJson.deviceType;
    }

}

export class FlowObject{
    //we're just gonna go with this for now.
    _id: any;
    type: string;
    name: string;   
    triangles: [];   
    x: number;  
    y: number;      
    z: number;      
    q_x: number;      
    q_y: number;    
    q_z: number;       
    q_w: number;      
    s_x: number;    
    s_y: number;    
    s_z: number;
    // As far as I can tell we're not actually going to use color/vertices/uv because
    // we're not storing the objects in the database. 
    color: any;
    vertices: any;     
    uv: any;  
    texture: [];        
    textureHeight: number;  
    textureWidth: number;
    textureFormat: number;
    mipmapCount: number;

    constructor(json: any){
        
        this.type = json.type;
        this.name = json.name;   
        this.triangles= json.triangles;   
        this.x= json.x;  
        this.y= json.y;      
        this.z= json.z;      
        this.q_x=json.q_z;      
        this.q_y=json.q_y;    
        this.q_z=json.q_z;       
        this.q_w=json.q_w;      
        this.s_x=json.s_x;    
        this.s_y= json.s_y;    
        this.s_z=json.s_z;
        // As far as I can tell we're not actually going to use color/vertices/uv because
        // we're not storing the objects in the database. 
        this.color=json.color;
        this.vertices=json.vertices;     
        this.uv=json.uv;  
        this.texture=json.texture;    
        this.textureHeight=json.textureHeight
        this.textureWidth=json.textureWidth;
        this.textureFormat=json.textureFormat;
        this.mipmapCount=json.mipmapCount;
    }
}


export class FlowProject{
    _id: any;
    description: string;
    created: number;
    dateModified: number;
    projectName: string;

    constructor(json:any){
        this._id = json._id
        this.description = json.description;
        this.created = json.description;
        this.projectName = json.projectName;
    }
}


export class FlowUser{
    _id: any;
    username: string;
    password: string;
    clients: Array<string>;
    activeProject: string;
    projects: Array<string>;
    friends: Array<string>;

    constructor(json:any){
        this.username = json.username;
        this.password = json.password;
    }
}