import { Color } from "./Color";

export class FlowVSGraph
{
  // Data the FlowVSGraph stores
  public Name:                string;
  public SerializedNodes:     string;
  public Edges:               string;
  public Groups:              string;
  public StackNodes:          string;
  public PinnedElements:      string;
  public ExposedParameters:   string;
  public StickyNotes:         string;
  public Position:            string;
  public Scale:               string;
  public References:          string;

  // Fields used for tracking this graph in the FAM

  // Graphs will highly likely use the following fields:
  public Id: string; 
  public RoomNumber: number;
  public CurrentCheckout: string; // TODO: Entire graphs are not checked out/in, nodes are, but for now the graph itself can be

  constructor(json: any)
  {
    this.Id = json.Id;
    this.Name = json.Name;
    this.SerializedNodes = JSON.stringify(json.serializedNodes);
    this.Edges = JSON.stringify(json.edges);
    this.Groups = JSON.stringify(json.groups);
    this.StackNodes = JSON.stringify(json.stackNodes);
    this.PinnedElements = JSON.stringify(json.pinnedElements);
    this.ExposedParameters = JSON.stringify(json.exposedParameters);
    this.StickyNotes = JSON.stringify(json.stickyNotes);
    this.Position = JSON.stringify(json.position);
    this.Scale = JSON.stringify(json.scale);
    this.References = JSON.stringify(json.references);
    this.CurrentCheckout = null;
}

  /**
   * Updates the properties of this graph with that of the passed in flowVSGraph
   * @param newVSGraph the graph with the properties that should be copied
   */
  public UpdateProperties(newVSGraph: FlowVSGraph)
  {    
    this.Name = newVSGraph.Name;
    this.SerializedNodes = newVSGraph.SerializedNodes;
    this.Edges = newVSGraph.Edges;
    this.Groups = newVSGraph.Groups;
    this.StackNodes = newVSGraph.StackNodes;
    this.PinnedElements = newVSGraph.PinnedElements;
    this.ExposedParameters = newVSGraph.ExposedParameters;
    this.StickyNotes = newVSGraph.StickyNotes;
    this.Position = newVSGraph.Position;
    this.Scale = newVSGraph.Scale;
    this.References = newVSGraph.References;
  }
}