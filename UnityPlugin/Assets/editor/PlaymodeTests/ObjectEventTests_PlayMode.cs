using System.Collections;
using System.Collections.Generic;
using NUnit.Framework;
using UnityEngine;
using UnityEngine.TestTools;
using Assets.RealityFlow.Scripts.Events;

namespace Tests
{
    public class ObjectEventTests_PlayMode
    {

        [UnitySetUp]
        public IEnumerator Setup()
        {
            GameObject camera = new GameObject("MainCamera");
            camera.AddComponent<Camera>();
            camera.tag = "MainCamera";

            GameObject manager = GameObject.FindGameObjectWithTag("ObjManager");
            if (manager == null)
            {
                manager = new GameObject("ObjManager");
                manager.tag = "ObjManager";
                manager.AddComponent(typeof(ObjectManager));
                manager.AddComponent(typeof(FlowNetworkManager));
                manager.GetComponent<FlowNetworkManager>()._debug = false;
                manager.GetComponent<FlowNetworkManager>().LocalServer = Config.LOCAL_HOST;
                manager.GetComponent<FlowNetworkManager>().mainGameCamera = GameObject.FindGameObjectWithTag("MainCamera");
            }

            yield return null;
        }


        [UnityTearDown]
        public IEnumerator Teardown()
        {
            GameObject manager = GameObject.FindGameObjectWithTag("ObjManager");
            GameObject camera = GameObject.FindGameObjectWithTag("MainCamera");
            Object.Destroy(manager);
            Object.Destroy(camera);

            yield return null;
        }


        // A UnityTest behaves like a coroutine in Play Mode. In Edit Mode you can use
        // `yield return null;` to skip a frame.
        [UnityTest]
        public IEnumerator CreateObjectEventTestsWithEnumerator()
        {
            // Arrange
            string response = Utilities.MockServerResponse("createobject.txt");
            FlowNetworkManager.reply = response;
            
            string objectName = "cubey";
            string expectedReturnValue = "Recieving Object Creation update: " + response;

            // Act
            string actualReturnValue = ObjectCreationEvent.Receive();

            // Assert - Check return value of Receive function and check that userid is set
            Assert.IsNotNull(GameObject.Find(objectName), "Missing component " + objectName);
            Assert.AreEqual(expectedReturnValue, actualReturnValue);

            // Use yield to skip a frame.
            yield return null;
        }


        // A UnityTest behaves like a coroutine in Play Mode. In Edit Mode you can use
        // `yield return null;` to skip a frame.
        [UnityTest]
        public IEnumerator FetchProjectEventTestsWithEnumerator()
        {
            // Arrange
            string response = Utilities.MockServerResponse("fetchproject.txt");
            FlowNetworkManager.reply = response;

            string objectName1 = "key";
            string objectName2 = "Sphere";
            string expectedReturnValue = "Receiving project open update: " + response;

            // Act
            string actualReturnValue = ProjectFetchEvent.Receive();

            // Assert - Check return value of Receive function and check that userid is set
            Assert.IsNotNull(GameObject.Find(objectName1), "Missing component " + objectName1);
            Assert.IsNotNull(GameObject.Find(objectName2), "Missing component " + objectName2);
            Assert.AreEqual(expectedReturnValue, actualReturnValue);

            // Use yield to skip a frame.
            yield return null;
        }


        // A UnityTest behaves like a coroutine in Play Mode. In Edit Mode you can use
        // `yield return null;` to skip a frame.
        [UnityTest]
        public IEnumerator ObjectUpdateEventTestsWithEnumerator()
        {
            // Arrange
            FetchProject();
            FlowNetworkManager.connection_established = true;

            GameObject key = GameObject.Find("key");
            key.GetComponent<FlowObject>().selected = true;

            // Act
            key.transform.position = new Vector3(0f, 1f, 0f);
           
            // Assert
            Assert.IsTrue(CommandProcessor.cmdBuffer.Count == 0, "There are multiple events in the buffer");

            // skip a frame
            yield return null;

            FlowEvent updateObject = CommandProcessor.cmdBuffer.Find(x => x.command == Commands.FlowObject.UPDATE);
            Assert.IsNotNull(updateObject, "No Object Update event found in buffer");

            // Use yield to skip a frame.
            yield return null;
        }


        private void FetchProject()
        {
            // Arrange
            string response = Utilities.MockServerResponse("fetchproject.txt");
            FlowNetworkManager.reply = response;

            // Act
            ProjectFetchEvent.Receive();
        }
    }
}
