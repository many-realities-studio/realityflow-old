//using System.Collections;
//using System.Collections.Generic;
//using RealityFlow.Plugin.Scripts.Events;
//using NUnit.Framework;
//using UnityEngine;
//using UnityEngine.TestTools;
//using RealityFlow.Plugin.Scripts;

//namespace RealityFlow.Plugin.Tests
//{
//    public class ObjectEventTests
//    {

//        [SetUp]
//        public void Setup()
//        {
//            CommandProcessor.cmdBuffer.Clear();
//        }


//        /// <summary>
//        /// This test verifies that an object create event is created and sent to the command processor
//        /// </summary>
//        [Test]
//        public void SendObjectCreateEventTest()
//        {
//            // Arrange
//            Config.projectId = "09876";
//            FlowTObject anObject = new FlowTObject();
//            ObjectCreationEvent createEvent = new ObjectCreationEvent();

//            // Act - Insert create event into buffer
//            createEvent.Send(anObject);

//            // Assert - Check buffer for create event
//            bool result = CommandProcessor.cmdBuffer.Contains(createEvent);
//            Assert.IsTrue(result, "Command buffer does not contain the create object event");
//        }


//        /// <summary>
//        /// This test verifies that an object delete event is created and sent to the command processor
//        /// </summary>
//        [Test]
//        public void ObjectDeleteEventTest()
//        {
//            // Arrange
//            string objectId = "12345678";
//            Config.projectId = "5668";
//            Config.deviceId = "9101112";

//            ObjectDeleteEvent deleteEvent = new ObjectDeleteEvent();

//            // Act - Insert delete event into buffer
//            deleteEvent.Send(objectId);

//            // Assert - Check buffer for delete event
//            bool result = CommandProcessor.cmdBuffer.Contains(deleteEvent);
//            Assert.IsTrue(result, "Command buffer does not contain the delete event");
//        }
//    }
//}