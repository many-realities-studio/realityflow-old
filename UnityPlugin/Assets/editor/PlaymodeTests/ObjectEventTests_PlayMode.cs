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
               //  manager.AddComponent(typeof(DoOnMainThread));
            }

            yield return null;
        }

        [UnityTearDown]
        public IEnumerator Teardown()
        {
            GameObject manager = GameObject.FindGameObjectWithTag("ObjManager");
            GameObject camera = GameObject.FindGameObjectWithTag("MainCamera");
            GameObject.Destroy(manager);
            GameObject.Destroy(camera);

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
    }
}
