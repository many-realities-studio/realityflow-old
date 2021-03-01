/* Goals

    - Want 3 types of undos
        1. last change on specific object
        2. last change by specific user
        3. Last change done ever

    We 

Types of Commands:

    - Add Node
    - Move Nodes
    - Delete Nodes
    - Connect Edges / Connect Nodes

    - Run Graph
    - Clear Graph

    - Undo & Redo


TODO:
    we need to store a state of the graph with each command that way we now what state the graph will go back to when 

*/


using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System;
using GraphProcessor;

public abstract class Command : MonoBehaviour
{   
    public string action;
    string graphState; // This just stores the state of the graph BEFORE the command was performed.

    // TODO: have some way to store graph changes here too

    public Command(string desc, string sp){
        this.action = desc;
        // this.graph = graph;
        this.graphState = sp;
    }

    //public abstract void UndoCommand();
    /*public virtual void UndoCommand()
    {
        Debug.Log(this.graph);
        BaseGraph g = GameObject.Find("RuntimeGraph").GetComponent<RealityFlowGraphView>().graph;
        g = this.graph;
    }*/

    public string GetGraphState(){
        return graphState;
    }

    public virtual string PrintCommand(){
        return String.Format("{0}", this.action);
    }
}

public class AddNodeCommand : Command {
    public AddNodeCommand(string desc, string sp) : base (desc, sp){}

}


public class DeleteNodeCommand : Command {
    List<BaseNode> nodes;
    // TODO: Get list of gameobjects as well
    public DeleteNodeCommand(string desc, string sp) : base (desc, sp){}

    /*public override void UndoCommand()
    {
        foreach(BaseNode n in nodes)
        {
            RealityFlowGraphView.instance.graph.AddNode(n);
        }
        //throw new NotImplementedException();
    }*/
}

