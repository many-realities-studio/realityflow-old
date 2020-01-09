using System.Collections;
using System.Collections.Generic;
using Assets.RealityFlow.Scripts.Events;
using NUnit.Framework;

namespace Tests
{
    public class ProjectEventTests
    {

        [SetUp]
        public void Setup()
        {
            CommandProcessor.cmdBuffer.Clear();
        }


        /// <summary>
        /// This test verifies that a project create event is created and sent to the command processor
        /// </summary>
        [Test]
        public void ProjectCreateEventTest()
        {
            // Arrange
            string projectName = "My First Projejct";
            Config.userId = "09876";
            Config.deviceId = "Plugin";

            ProjectCreateEvent createEvent = new ProjectCreateEvent();

            // Act - Insert create event into buffer
            createEvent.Send(projectName);

            // Assert - Check buffer for create event
            bool result = CommandProcessor.cmdBuffer.Contains(createEvent);
            Assert.IsTrue(result, "Command buffer does not contain the create event");
        }


        /// <summary>
        /// This test verifies that a project fetch event is created and sent to the command processor
        /// </summary>
        [Test]
        public void ProjectFetchEventTest()
        {
            // Arrange
            Config.projectId = "5668";
            Config.deviceId = "9101112";

            ProjectFetchEvent fetchEvent = new ProjectFetchEvent();

            // Act - Insert fetch event into buffer
            fetchEvent.Send();

            // Assert - Check buffer for fetch event
            bool result = CommandProcessor.cmdBuffer.Contains(fetchEvent);
            Assert.IsTrue(result, "Command buffer does not contain the fetch event");
        }


        /// <summary>
        /// This test verifies that a project invite event is created and sent to the command processor
        /// </summary>
        [Test]
        public void ProjectInviteEventTest()
        {
            // Arrange
            string username = "joe123";
            Config.projectId = "5668";

            ProjectInviteEvent inviteEvent = new ProjectInviteEvent();

            // Act - Insert invite event into buffer
            inviteEvent.send(username);

            // Assert - Check buffer for invite event
            bool result = CommandProcessor.cmdBuffer.Contains(inviteEvent);
            Assert.IsTrue(result, "Command buffer does not contain the invite event");
        }
    }
}