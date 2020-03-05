using Newtonsoft.Json;
using Packages.realityflow_package.Runtime.scripts.Messages;
using Packages.realityflow_package.Runtime.scripts.Messages.UserMessages;
//using RealityFlow.Plugin.Scripts.Events;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Runtime.Serialization;
using System.Runtime.Serialization.Json;
using System.Text;
using System.Threading.Tasks;
using UnityEngine;

namespace Packages.realityflow_package.Runtime.scripts
{
    public class ReceivedMessageParser
    {
        public static Dictionary<string, BaseMessage.ParseMessage> messageRouter = new Dictionary<string, BaseMessage.ParseMessage>();

        static ReceivedMessageParser()
        {
            messageRouter.Add("Login", Login_Recieved.ReceiveMessage);
        }

        public static void Parse(string message)
        {
            string messageType = GetMessageType(message);
            messageRouter[messageType](message);
        }

        public static string GetMessageType(string messageToConvert)
        {
            var p2 = MessageSerializer.DesearializeObject<BaseMessage>(messageToConvert);

            Debug.Log("Getting message type: " + p2.MessageType);

            return p2.MessageType;
        }
    }
}
