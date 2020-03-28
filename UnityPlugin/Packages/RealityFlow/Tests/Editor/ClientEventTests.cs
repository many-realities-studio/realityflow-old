//using System.Collections.Generic;
//using RealityFlow.Plugin.Scripts.Events;
//using NUnit.Framework;
//using RealityFlow.Plugin.Scripts;

//namespace RealityFlow.Plugin.Tests
//{
//    public class ClientEventTests
//    {

//        [SetUp]
//        public void Setup()
//        {
//            CommandProcessor.cmdBuffer.Clear();
//        }


//        /// <summary>
//        /// This test verifies that a client register event is created and sent to the command processor
//        /// </summary>
//        [Test]
//        public void ClientRegisterEventTest()
//        {
//            // Arrange
//            int deviceType = FlowClient.CLIENT_HOLOLENS;
//            Config.userId = "09876";

//            ClientRegisterEvent registerEvent = new ClientRegisterEvent();

//            // Act - Insert register event into buffer
//            registerEvent.Send(deviceType);

//            // Assert - Check buffer for register event
//            bool result = CommandProcessor.cmdBuffer.Contains(registerEvent);
//            Assert.IsTrue(result, "Command buffer does not contain the register event");
//        }


//        /// <summary>
//        /// This test verifies that a Client Register event sets its _id member correctly
//        /// </summary>
//        [Test]
//        public void ClientRegisterEventTest_RetrievesUserID()
//        {

//            // Arrange
//            int expectedDeviceType = FlowClient.CLIENT_HOLOLENS;
//            string expectedUserID = "09876";
//            Config.userId = expectedUserID;

//            ClientRegisterEvent registerEvent = new ClientRegisterEvent();

//            // Act - Insert register event into buffer
//            registerEvent.Send(expectedDeviceType);

//            // Assert - Check that userId and deviceType are set correctly
//            string actualUserID = registerEvent.user._id;
//            Assert.AreEqual(expectedUserID, actualUserID, "The user ID is not set correctly");

//            int actualDeviceType = registerEvent.client.deviceType;
//            Assert.AreEqual(expectedDeviceType, actualDeviceType, "The device type is not set correctly");
//        }
//    }
//}