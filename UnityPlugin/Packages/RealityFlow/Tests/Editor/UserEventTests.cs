using RealityFlow.Plugin.Scripts.Events;
using NUnit.Framework;
using System.IO;
using RealityFlow.Plugin.Scripts;

namespace RealityFlow.Plugin.Tests
{
    public class UserEventTests
    {
        private string username = "bill";
        private string password = "gates";

        [SetUp]
        public void Setup()
        {
            CommandProcessor.cmdBuffer.Clear();
            Config.ResetValues();
        }


        /// <summary>
        /// This test verifies that a login flow event is created and sent to the command processor
        /// </summary>
        [Test]
        public void SendUserLoginEventTest()
        {
            // Arrange
            UserLoginEvent loginEvent = new UserLoginEvent();

            // Act - Insert login event into buffer
            loginEvent.Send(username, password, FlowClient.CLIENT_EDITOR);

            // Assert - Check buffer for login event and for correct login info
            bool expectedLoginSet = (loginEvent.user.username == username) && (loginEvent.user.password == password);
            Assert.IsTrue(expectedLoginSet, "Username or password not set");

            bool resultAfter = CommandProcessor.cmdBuffer.Contains(loginEvent);
            Assert.IsTrue(resultAfter, "Command buffer does not contain the login event");
        }


        /// <summary>
        /// This test verifies that a login event is received and the json response is deserialized
        /// </summary>
        [Test]
        public void ReceiveUserLoginEventTest()
        {
            // Arrange
            string response = Utilities.MockServerResponse("userlogin.txt");
            FlowNetworkManager.reply = response;

            string expectedReturnValue = "Receiving user login update: " + response;
            string expectedUserID = "5dc8db6108152a7b700215a6";

            string project1 = "Project 1";
            string project2 = "Project 2";

            // Act
            string actualReturnValue = UserLoginEvent.Receive();

            // Assert - Check return value of receive function and that project list contains correct projects
            Assert.AreEqual(expectedReturnValue, actualReturnValue);
            Assert.AreEqual(expectedUserID, Config.userId, "User ID not set correctly");
            Assert.AreEqual(2, Config.projectList.Count, "Incorrect number of projects");

            FlowProject flowProject1 = Config.projectList.Find(x => x.projectName.Equals(project1));
            Assert.AreEqual(project1, flowProject1.projectName, "Could not find project: {0}", project1);

            FlowProject flowProject2 = Config.projectList.Find(x => x.projectName.Equals(project2));
            Assert.AreEqual(project2, flowProject2.projectName, "Could not find project: {0}", project2);
        }


        /// <summary>
        /// This test verifies that a UserRegisterEvent is created and sent to the command processor
        /// </summary>
        [Test]
        public void SendUserRegisterEventTest()
        {
            // Arrange
            UserRegisterEvent registerEvent = new UserRegisterEvent();

            // Act - Insert register event into buffer
            registerEvent.Send(username, password, FlowClient.CLIENT_HOLOLENS);

            // Assert - Check buffer for register event
            bool expectedInfoSet = (registerEvent.user.username == username) && (registerEvent.user.password == password);
            Assert.IsTrue(expectedInfoSet, "Username or password not set");

            bool resultAfter = CommandProcessor.cmdBuffer.Contains(registerEvent);
            Assert.IsTrue(resultAfter, "Command buffer does not contain the register event");
        }


        /// <summary>
        /// This test verifies that the server's UserRegisterEvent response is received and the json is deserialized 
        /// </summary>
        [Test]
        public void ReceiveUserRegisterEventTest()
        {
            // Arrange
            string response = Utilities.MockServerResponse("userregister.txt");
            FlowNetworkManager.reply = response;

            string expectedReturnValue = "Receiving user create update: " + response;
            string expectedUserID = "5dfee6ce4c65f0208cbc9bed";

            // Act
            string actualReturnValue = UserRegisterEvent.Receive();

            // Assert - Check return value of Receive function and that userid is set
            Assert.AreEqual(expectedReturnValue, actualReturnValue);
            Assert.AreEqual(expectedUserID, Config.userId, "User ID not set correctly");
        }


        /// <summary>
        /// This test verifies that a logout flow event is created and sent to the command processor
        /// </summary>
        [Test]
        public void SendUserLogoutEventTest()
        {
            // Arrange
            string userID = "12345";

            Config.userId = userID;
            Config.deviceId = "Plugin";

            UserLogoutEvent logoutEvent = new UserLogoutEvent();

            // Act - Insert logout event into buffer
            logoutEvent.Send();

            // Assert - Check buffer for logout event
            bool resultAfter = CommandProcessor.cmdBuffer.Contains(logoutEvent);
            Assert.IsTrue(resultAfter, "Command buffer does not contain the logout event");
        }


        /// <summary>
        /// This test verifies that a logout event sets its _id member correctly
        /// from the Config when it is created
        /// </summary>
        [Test]
        public void SendUserLogoutEventTest_RetrievesUserID()
        {
            // Arrange
            string expectedUserID = "12345";

            Config.userId = expectedUserID;
            Config.deviceId = "Plugin";

            UserLogoutEvent logoutEvent = new UserLogoutEvent();

            // Act - Insert logout event into buffer
            logoutEvent.Send();

            string actualUserID = logoutEvent.user._id;

            // Assert - Check that userId gets set correctly
            Assert.AreEqual(expectedUserID, actualUserID, "The user ID is not set correctly");
        }
    }
}