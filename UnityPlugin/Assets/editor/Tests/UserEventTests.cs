using Assets.RealityFlow.Scripts.Events;
using NUnit.Framework;

namespace Tests
{
    public class UserEventTests
    {
        private string username = "bill";
        private string password = "gates";

        [SetUp]
        public void Setup()
        {
            CommandProcessor.cmdBuffer.Clear();
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
        /// This test verifies that a user register event is created and sent to the command processor
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