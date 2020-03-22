export class FlowObject{
    //we're just gonna go with this for now.
    public _id: any;
    public type: string;
    public name: string;   
    public triangles: [];   
    public x: number;  
    public y: number;      
    public z: number;      
    public q_x: number;      
    public q_y: number;    
    public q_z: number;       
    public q_w: number;      
    public s_x: number;    
    public s_y: number;    
    public s_z: number;
    // As far as I can tell we're not actually going to use color/vertices/uv because
    // we're not storing the objects in the database. 
    public color: any;
    public vertices: any;     
    public uv: any;  
    public texture: [];        
    public textureHeight: number;  
    public textureWidth: number;
    public textureFormat: number;
    public mipmapCount: number;

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