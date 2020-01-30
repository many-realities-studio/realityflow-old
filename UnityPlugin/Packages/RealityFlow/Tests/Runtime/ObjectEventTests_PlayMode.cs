using System.Collections;
using System.Collections.Generic;
using NUnit.Framework;
using UnityEngine;
using UnityEngine.TestTools;
using RealityFlow.Plugin.Scripts;
using RealityFlow.Plugin.Scripts.Events;

namespace RealityFlow.Plugin.Tests
{
    public class ObjectEventTests_PlayMode
    {

        [UnitySetUp]
        public IEnumerator Setup()
        {
            // setup camera
            GameObject camera = new GameObject("MainCamera");
            camera.AddComponent<Camera>();
            camera.tag = "MainCamera";

            // setup object manager
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
            // find and destroy the object and maincamera objects
            GameObject manager = GameObject.FindGameObjectWithTag("ObjManager");
            GameObject camera = GameObject.FindGameObjectWithTag("MainCamera");

            Object.Destroy(manager);
            Object.Destroy(camera);

            yield return null;
        }


        /// <summary>
        /// Tests that an object is created and placed in the scene
        /// </summary>
        [UnityTest]
        public IEnumerator CreateObjectEventTestWithEnumerator()
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


        /// <summary>
        /// Tests that all objects are placed in the scene on project load
        /// </summary>
        [UnityTest]
        public IEnumerator FetchProjectEventTestWithEnumerator()
        {
            // Arrange
            string response = Utilities.MockServerResponse("fetchproject.txt");
            FlowNetworkManager.reply = response;
            string expectedReturnValue = "Receiving project open update: " + response;

            string objectName1 = "key";
            string objectName2 = "Sphere";
            
            // Act
            string actualReturnValue = ProjectFetchEvent.Receive();

            // Assert - Check return value of Receive function and check all objects are in the scene
            Assert.IsNotNull(GameObject.Find(objectName1), "Missing component " + objectName1);
            Assert.IsNotNull(GameObject.Find(objectName2), "Missing component " + objectName2);

            Assert.AreEqual(expectedReturnValue, actualReturnValue);

            // Use yield to skip a frame.
            yield return null;
        }


        /// <summary>
        /// Tests that an ObjectUpdate event is created after attemtpting to move an object in the scene
        /// </summary>
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
            Assert.IsTrue(CommandProcessor.cmdBuffer.Count == 0, "The buffer is not empty when it should be");

            // Skip a frame
            yield return null;

            FlowEvent updateObject = CommandProcessor.cmdBuffer.Find(x => x.command == Commands.FlowObject.UPDATE);
            Assert.IsNotNull(updateObject, "No Object Update event found in buffer");

            // Use yield to skip a frame.
            yield return null;
        }


        /// <summary>
        /// This function gets a FetchProject response from the server and deserializes the json 
        /// </summary>
        private void FetchProject()
        {
            string response = Utilities.MockServerResponse("fetchproject.txt");
            FlowNetworkManager.reply = response;

            ProjectFetchEvent.Receive();
        }
    }
}
