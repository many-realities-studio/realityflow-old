using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEditor;
using UnityEngine.UIElements;
using GraphProcessor;

public class CommandPalette : MonoBehaviour
{

    const int MAX_NUMBER_OF_COMMANDS = 10;
    static List<Command> commandStack;

    public CommandPalette(){
        commandStack = new List<Command>();
    }

    /*** Stack Handling ***/

    // Adding commands to the stack
    public void AddCommandToStack( Command cmd ){
        // manage before we hit our max number
        commandStack.Insert(0, cmd);
        // if there's more than the alloted number of commands, drop them until our command palette is at the right
        while (commandStack.Count > MAX_NUMBER_OF_COMMANDS){
            commandStack.RemoveAt(commandStack.Count-1);
        }        
    }

    public List<Command> GetCommandStack(){
        return commandStack;
    }
    // Undo Functions
    /*
    public void UndoTesting()
    {
        // Get the graph state from the command.

        Debug.Log(" which is tied to the command "+commandStack[0].PrintCommand());
        //Undo.PerformUndo();
        //Undo.ClearAll();
        commandStack[0].UndoCommand();
    }
    */
    /*void OverallUndo(int indexToRemove){
        if (commandStack.Count <= 0 ){
            // Do nothing because the stack is empty
        } else {
            Command c = commandStack[indexToRemove];
            if(c.action == "Add Node")
            {
                // RealityFlowGraphView.instance.graph.RemoveNode(c.node);
                //graph.SetDirty();
                // Destroy(c.o);
            }
            else if(c.action == "Remove Node")
            {
            commandStack.RemoveAt(indexToRemove);
            //BaseNode n = RealityFlowGraphView.instance.AddNodenoStack();  // MARK FOR DELETE
            BaseGraph g = GameObject.Find("RuntimeGraph").GetComponent<RealityFlowGraphView>().graph;
            BaseNode n = g.add;
            // n.GUID = c.objectGUID;
            }
        }
        //commandStack.RemoveAt(indexToRemove);
    }
    */
    public void UndoLastChange(){
        // Pops the most recent change from the stack.
        int indexToRemove = commandStack.Count - 1;
        //OverallUndo(indexToRemove);


    }

    // Takes userID as argument
    void UndoLastChangeByUserID(string userID){
        // Searches stack until it finds the first command matching the id of the user and pops it from stack
    }

    // Takes objectID as argument
    void UndoLastChangeByObjectID (string GUID){
        // Searches stack until it finds the first command matching the id of the object and pops it from stack
        // for (int i = 0; i < commandStack.Count; i++){
        //     if ( commandStack[i].GetGUID() == GUID ){
        //         commandStack.RemoveAt(i);
        //     }
        // }
    }




    // GUI functions
    // FUnctions that send info to server (maybe)
    // Debug functions
    // TODO: Find a new way to display the stack (GUI elements in VR)
    public void PrintStack(){
        for (int i = 0; i < commandStack.Count; i++){
            Debug.Log(i + ": " + commandStack[i].PrintCommand());
        }
    }

}
