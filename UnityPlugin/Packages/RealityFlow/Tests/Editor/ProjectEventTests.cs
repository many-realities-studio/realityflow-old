//using System.Collections;
//using System.Collections.Generic;
//using RealityFlow.Plugin.Scripts.Events;
//using NUnit.Framework;
//using RealityFlow.Plugin.Scripts;

//namespace RealityFlow.Plugin.Tests
//{
//    public class ProjectEventTests
//    {

//        [SetUp]
//        public void Setup()
//        {
//            CommandProcessor.cmdBuffer.Clear();
//            Config.ResetValues();
//        }

//        /// <summary>
//        /// This test verifies that a project create event is created and sent to the command processor
//        /// </summary>
//        [Test]
//        public void SendProjectCreateEventTest()
//        {
//            // Arrange
//            string projectName = "My First Projejct";
//            Config.userId = "09876";
//            Config.deviceId = "Plugin";

//            ProjectCreateEvent createEvent = new ProjectCreateEvent();

//            // Act - Insert create event into buffer
//            createEvent.Send(projectName);

//            // Assert - Check buffer for create event
//            bool result = CommandProcessor.cmdBuffer.Contains(createEvent);
//            Assert.IsTrue(result, "Command buffer does not contain the create event");
//        }


//        /// <summary>
//        /// This test verifies that a project create event is received and the json response is deserialized
//        /// </summary>
//        [Test]
//        public void ReceiveProjectCreateEventTest()
//        {

//            // Arrange
//            string projectName = "pencil";
//            string response = Utilities.MockServerResponse("createproject.txt");
//            FlowNetworkManager.reply = response;

//            string expectedReturnValue = "Receiving project create update: " + response;
//            Config.projectList = new List<FlowProject>();

//            // Act
//            string actualReturnValue = ProjectCreateEvent.Receive();

//            // Assert - Check return value of Receive function and check that the new project is added to the project list
//            FlowProject addedProject = Config.projectList.Find(x => x.projectName.Equals(projectName));

//            Assert.AreEqual(projectName, addedProject.projectName, "Did not set the name for the new project correctly");
//            Assert.AreEqual(expectedReturnValue, actualReturnValue);
//        }


//        /// <summary>
//        /// This test verifies that a project fetch event is created and sent to the command processor
//        /// </summary>
//        [Test]
//        public void ProjectFetchEventTest()
//        {
//            // Arrange
//            Config.projectId = "5668";
//            Config.deviceId = "9101112";

//            ProjectFetchEvent fetchEvent = new ProjectFetchEvent();

//            // Act - Insert fetch event into buffer
//            fetchEvent.Send();

//            // Assert - Check buffer for fetch event
//            bool result = CommandProcessor.cmdBuffer.Contains(fetchEvent);
//            Assert.IsTrue(result, "Command buffer does not contain the fetch event");
//        }


//        /// <summary>
//        /// This test verifies that a project invite event is created and sent to the command processor
//        /// </summary>
//        [Test]
//        public void ProjectInviteEventTest()
//        {
//            // Arrange
//            string username = "joe123";
//            Config.projectId = "5668";

//            ProjectInviteEvent inviteEvent = new ProjectInviteEvent();

//            // Act - Insert invite event into buffer
//            inviteEvent.send(username);

//            // Assert - Check buffer for invite event
//            bool result = CommandProcessor.cmdBuffer.Contains(inviteEvent);
//            Assert.IsTrue(result, "Command buffer does not contain the invite event");
//        }
//    }
//}