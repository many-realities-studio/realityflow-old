using Packages.realityflow_package.Runtime.scripts.Messages;
using Packages.realityflow_package.Runtime.scripts.Messages.UserMessages;
using RealityFlow.Plugin.Scripts;
using System;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Runtime.Serialization;
using System.Runtime.Serialization.Json;
using System.Text;
using System.Threading.Tasks;
using UnityEngine;
using WebSocketSharp;

namespace Packages.realityflow_package.Runtime.scripts
{
    [ExecuteAlways]
    public class FlowWebsocket : MonoBehaviour
    {
        /// <summary>
        /// A message parser is the part of the program that interprets and brings
        /// actions to the messages being received
        /// </summary>
        /// <param name="message"></param>
        public delegate void MessageParser(string message);
        public MessageParser messageParser;

        public static List<String> ReceivedMessages = new List<string>();
        public static WebSocketSharp.WebSocket websocket;

        public FlowWebsocket(string url)
        {
            messageParser = ReceivedMessageParser.Parse;
            Connect(url);
        }

        public void Connect(string url)
        {
            //string url = "ws://echo.websocket.org";
            Debug.Log("Establishing websocket connection to " + url);
            websocket = new WebSocketSharp.WebSocket(url);
            //websocket.OnMessage += (sender, e) => Debug.Log("Received message: " + e.Data.ToString());
            websocket.OnMessage += (sender, e) => ActionOnReceiveMessage(e.Data.ToString());
            websocket.Connect();

            Debug.Log("Connection established with " + url);
        }

        public new void SendMessage(string message)
        {
            Debug.Log("Sending message: " + message);
            websocket.Send(message);
        }

        public void SendMessage<T>(T message) where T : BaseMessage
        {
            MemoryStream memoryStream = MessageSerializer.SerializeMessage<T>(message);
            //websocket.Send(memoryStream, (int)memoryStream.Length);
            //string messageToSend = JsonUtility.ToJson(message);

            memoryStream.Position = 0;
            var sr = new StreamReader(memoryStream);
            string sentMessage = sr.ReadToEnd();
            Debug.Log("Sending message: " + sentMessage);

            websocket.Send(sentMessage);

            //System.IO.File.WriteAllText(@"C:\Users\Matthew Kurtz\Desktop\FlowTests\SentCommands\" + typeof(T).ToString() +  ".json", sentMessage);

            // Deserialization

            //memoryStream.Position = 0;
            //var p2 = (RegisterUser_SendToServer) serializer.ReadObject(memoryStream);

            //Debug.Log("Type is " + p2.ToString());

            //Debug.Log($"Deserialized: messageType = {p2.MessageType}, username = {p2.Username}, password = {p2.Password}");

            //websocket.Send(messageToSend);
            //websocket.Send()
        }

        public void SendMessage(FlowEvent flowEvent)
        {
            string messageToSend = JsonUtility.ToJson(flowEvent);

            Debug.Log("Sending message: " + messageToSend);
            websocket.Send(messageToSend);
        }

        private void ActionOnReceiveMessage(string message)
        {
            Debug.Log("Event handler received message: " + message);
            ReceivedMessages.Add(message);
        }

        public IEnumerator ReceiveMessage()
        {
            foreach (string message in ReceivedMessages)
            {
                Debug.Log("Received message: " + message);
                messageParser(message);
                //GameObject.CreatePrimitive(PrimitiveType.Cube);
            }

            ReceivedMessages.RemoveAll((o) => true); // Remove everything from the list

            yield return null;
        }
    }
}
