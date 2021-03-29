import { Color } from "./Color";

export class FlowVSGraph
{
  // Data the FlowVSGraph stores
  public Name:                string;
  public serializedNodes:     string;
  public edges:               string;
  public groups:              string;
  public stackNodes:          string;
  public pinnedElements:      string;
  public exposedParameters:   string;
  public stickyNotes:         string;
  public position:            string;
  public scale:               string;
  public references:          string;

  // Fields used for tracking this graph in the FAM

  // Graphs will highly likely use the following fields:
  public Id: string; 
  public RoomNumber: number;
  public CurrentCheckout: string; // TODO: Entire graphs are not checked out/in, nodes are, but for now the graph itself can be

  constructor(json: any)
  {
    this.Id = json.Id;
    this.Name = json.Name;
    this.serializedNodes = JSON.stringify(json.serializedNodes);
    this.edges = JSON.stringify(json.edges);
    this.groups = JSON.stringify(json.groups);
    this.stackNodes = JSON.stringify(json.stackNodes);
    this.pinnedElements = JSON.stringify(json.pinnedElements);
    this.exposedParameters = JSON.stringify(json.exposedParameters);
    this.stickyNotes = JSON.stringify(json.stickyNotes);
    this.position = JSON.stringify(json.position);
    this.scale = JSON.stringify(json.scale);
    this.references = JSON.stringify(json.references);
    this.CurrentCheckout = null;
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
  }
}