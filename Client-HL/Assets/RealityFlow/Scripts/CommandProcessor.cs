using System.Collections.Generic;
using Assets.RealityFlow.Scripts.Events;

//[ExecuteInEditMode]
public class CommandProcessor
{
    public static List<FlowEvent> cmdBuffer = new List<FlowEvent>();

    public delegate string delegate_receive_evt();
    public static Dictionary<int, delegate_receive_evt> receiveEvents = new Dictionary<int, delegate_receive_evt>();

    public static void initializeRecieveEvents()
    {
        // Object Events
        receiveEvents.Add(ObjectUpdateEvent.scmd, ObjectUpdateEvent.Receive);
        receiveEvents.Add(ObjectCreationEvent.scmd, ObjectCreationEvent.Receive);
        receiveEvents.Add(ObjectDeleteEvent.scmd, ObjectDeleteEvent.Receive);

        // Project Events
        receiveEvents.Add(ProjectCreateEvent.scmd, ProjectCreateEvent.Receive);
        receiveEvents.Add(ProjectFetchEvent.scmd, ProjectFetchEvent.Receive);
        receiveEvents.Add(ProjectInviteEvent.scmd, ProjectInviteEvent.Receive);

        // User Events
        receiveEvents.Add(UserLoginEvent.scmd, UserLoginEvent.Receive);
        receiveEvents.Add(UserRegisterEvent.scmd, UserRegisterEvent.Receive);
    }

    public static void processCommand(FlowEvent incoming)
    {
        // runs the receive delegate that corresponds to the incoming command and stores any debug logs in debug_updates
        string debug_updates = receiveEvents[incoming.command]();
        
        // logs debug updates
        FlowNetworkManager.log(debug_updates);
    }

    public static void sendCommand(FlowEvent evt)
    {
        cmdBuffer.Add(evt);
    }
}
