using UnityEngine;
using UnityEngine.UI;
using System;
using System.Collections;
using System.Collections.Generic;
using Assets.RealityFlow.Scripts.Events;

[System.Serializable]
public class FlowProjectCommand : FlowEvent
{
    public new FlowProjectPayload value;
}

[System.Serializable]
public class clientRegisterCommand : FlowEvent
{
    public string details;
}

//[ExecuteInEditMode]
public class CommandProcessor
{
    const int PARAMETER_TRANSFORM = 0;
    const int PARAMETER_ROTATION = 1;
    const int PARAMETER_SCALE = 2;
    const int PARAMETER_RECT_TRANSFORM = 3;
    const int PARAMETER_IMAGE = 4;

    private static bool commandToBeSent;
    public static List<FlowEvent> cmdBuffer = new List<FlowEvent>();
    public static Dictionary<int, delegate_receive_evt> recieveEvents = new Dictionary<int, delegate_receive_evt>();
    public static Dictionary<int, delegate_flow_cmd> cmdCbDictionary = new Dictionary<int, delegate_flow_cmd>();

    public static Dictionary<int, delegate_flow_project> projectCbDictionary = new Dictionary<int, delegate_flow_project>();

    private static Dictionary<int, List<delegate_flow_cmd>> listenerCmdDictionary = new Dictionary<int, List<delegate_flow_cmd>>();
   private static Dictionary<int, List<delegate_flow_project>> listenerProjectDictionary = new Dictionary<int, List<delegate_flow_project>>();
    
    public delegate void delegate_flow_project(FlowProjectCommand project);

    public delegate void delegate_flow_cmd(FlowEvent cmd);

    public delegate string delegate_receive_evt();

    public static void initializeRecieveEvents()
    {
        recieveEvents.Add(FlowTransformEvent.scmd, FlowTransformEvent.Receive);
        recieveEvents.Add(ObjectCreationEvent.scmd, ObjectCreationEvent.Receive);
        recieveEvents.Add(UserLoginEvent.scmd, UserLoginEvent.Receive);
    }

    public static int counter = 0;
    public static void processProjectCommand(FlowProjectCommand incoming)
    {
        if (projectCbDictionary.ContainsKey(incoming.cmd))
        {
            delegate_flow_project cb;
            bool result = projectCbDictionary.TryGetValue(incoming.cmd, out cb);
            if (result)
            {
                cb(incoming);
            }
        }
        if (listenerProjectDictionary.ContainsKey(incoming.cmd))
        {
            List<delegate_flow_project> callbacks;
            listenerProjectDictionary.TryGetValue(incoming.cmd, out callbacks);
            foreach (delegate_flow_project cb in callbacks)
            {
                cb(incoming);
            }
        }
    }
    public static int processCommand(FlowEvent incoming)
    {
        int retValue = 0;
        if (cmdCbDictionary.ContainsKey(incoming.cmd))
        {
            delegate_flow_cmd cb;
            cmdCbDictionary.TryGetValue(incoming.cmd, out cb);
            cb(incoming);
            cmdCbDictionary.Remove(incoming.cmd);
        }
        if (listenerCmdDictionary.ContainsKey(incoming.cmd))
        {
            List<delegate_flow_cmd> callbacks;
            listenerCmdDictionary.TryGetValue(incoming.cmd, out callbacks);
            foreach (delegate_flow_cmd cb in callbacks)
            {
                cb(incoming);
            }
        }

        string debug_updates = recieveEvents[incoming.cmd]();

        if (FlowNetworkManager.debug)
            Debug.Log(debug_updates);

        return retValue;
    }

    public static void sendCommand(FlowEvent evt)
    {
        cmdBuffer.Add(evt);
    }

    public static void sendCommand(int command, string value)
    {
        FlowEvent newCmd = new FlowEvent();
        newCmd.cmd = command;
        newCmd.value = new FlowPayload();
        newCmd.value.data = value;
        cmdBuffer.Add(newCmd);
    }

    private static void sendCommand(int command, string value, delegate_flow_cmd callback)
    {
        FlowEvent newCmd = new FlowEvent();
        newCmd.cmd = command;
        newCmd.value.data = value;
        cmdBuffer.Add(newCmd);
        if (cmdCbDictionary.ContainsKey(command))
            cmdCbDictionary.Remove(command);
        cmdCbDictionary.Add(command, callback);
    }

    public static void registerListener(int command, delegate_flow_cmd listener)
    {
        if (listenerCmdDictionary.ContainsKey(command))
        {
            List<delegate_flow_cmd> listeners;
            listenerCmdDictionary.TryGetValue(command, out listeners);
            listeners.Add(listener);
        }
        else
        {
            List<delegate_flow_cmd> listeners = new List<delegate_flow_cmd>();
            listeners.Add(listener);
            listenerCmdDictionary.Add(command, listeners);
        }
    }
    private static void onRegisteredClient()
    {
        //sendCommand(Commands.Project.GET_ACTIVE, "", FlowNetworkManager.setActiveProject);
        // Registering listener for active project changes
        //registerListener(Commands.Project.SET_ACTIVE, FlowNetworkManager.setActiveProject);
    }


}
