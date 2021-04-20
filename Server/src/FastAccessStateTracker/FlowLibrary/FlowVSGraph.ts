import { Color } from "./Color";

export class FlowVSGraph
{
  // Data the FlowVSGraph stores
  public Name:                string;
  public serializedNodes:     Array<any>;
  public edges:               Array<any>;
  public groups:              Array<any>;
  public stackNodes:          Array<any>;
  public pinnedElements:      Array<any>;
  public exposedParameters:   Array<any>;
  public stickyNotes:         Array<any>;
  public position:            any;
  public scale:               any;
  public references:          any;
  public paramIdToObjId:      any;

  // Fields used for tracking this graph in the FAM
  public Id: string; 
  public RoomNumber: number;

  constructor(json: any)
  {
    this.Id = json.Id;
    this.Name = json.Name;
    this.serializedNodes = json.serializedNodes;
    this.edges = json.edges;
    this.groups = json.groups;
    this.stackNodes = json.stackNodes;
    this.pinnedElements = json.pinnedElements;
    this.exposedParameters = json.exposedParameters;
    this.stickyNotes = json.stickyNotes;
    this.position = json.position;
    this.scale = json.scale;
    this.references = json.references;
    this.paramIdToObjId = json.paramIdToObjId;
}

  /**
   * Updates the properties of this graph with that of the passed in flowVSGraph
   * @param newVSGraph the graph with the properties that should be copied
   */
  public UpdateProperties(newVSGraph: FlowVSGraph)
  {    
    this.Name = newVSGraph.Name;
    this.serializedNodes = newVSGraph.serializedNodes;
    this.edges = newVSGraph.edges;
    this.groups = newVSGraph.groups;
    this.stackNodes = newVSGraph.stackNodes;
    this.pinnedElements = newVSGraph.pinnedElements;
    this.exposedParameters = newVSGraph.exposedParameters;
    this.stickyNotes = newVSGraph.stickyNotes;
    this.position = newVSGraph.position;
    this.scale = newVSGraph.scale;
    this.references = newVSGraph.references;
    this.paramIdToObjId = newVSGraph.paramIdToObjId;
  }
}