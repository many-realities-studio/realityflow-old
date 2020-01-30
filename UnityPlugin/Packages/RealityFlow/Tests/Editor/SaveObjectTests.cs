using System;
using System.Collections;
using System.Collections.Generic;
using System.Reflection;
using RealityFlow.Plugin.Scripts.Events;
using NUnit.Framework;
using UnityEngine;
using UnityEngine.TestTools;
using RealityFlow.Plugin.Scripts;
using RealityFlow.Plugin.Editor;

namespace RealityFlow.Plugin.Tests
{
    public class SaveObjectTests
    {

        [SetUp]
        public void Setup()
        {
            CommandProcessor.cmdBuffer.Clear();
        }


        /// <summary>
        /// This test verifies that an object is saved into a FlowTObject and an object Creation Event is sent to the command processor
        /// </summary>
        [Test]
        public void SaveObjectDataTest()
        {
            // Arrange
            FlowTObject expectedFlowObject = new FlowTObject();
            Utilities.FillObjectWithData(expectedFlowObject);

            ObjectData inputObject = (ObjectData)ScriptableObject.CreateInstance(typeof(ObjectData));
            Utilities.FillObjectWithData(inputObject);

            //Act
            ObjectSettings.SaveObjectData(inputObject);

            // Assert
            List<FlowEvent> bufferList = CommandProcessor.cmdBuffer;
            Assert.IsTrue(bufferList.Count == 1, "There are multiple events in the buffer");

            dynamic actualEvent = bufferList[0];
            CompareObjects(expectedFlowObject, actualEvent.obj);
        }


        /// <summary>
        /// This function iterates through and compares the field variables of two separate FlowTObjects and throws either an Assertion or Success Exception
        /// </summary>
        /// <param name="expected">FlowTObject with expected values set</param>
        /// <param name="actual">FlowTObject with actual values set</param>
        private void CompareObjects(FlowTObject expected, FlowTObject actual)
        {
            // Retrieve the class field types
            FieldInfo[] field_infos = typeof(FlowTObject).GetFields();

            // iterate through each field and compare the expected and actual values
            foreach (FieldInfo info in field_infos)
            {

                try
                {
                    string expectedValue = info.GetValue(expected).ToString();
                    string actualValue = info.GetValue(actual).ToString();

                    // field type is an array if the type name contains brackets
                    if (expectedValue.Contains("[]"))
                    {
                        Array expectedArray = (Array)info.GetValue(expected);
                        Array actualArray = (Array)info.GetValue(actual);

                        Assert.AreEqual(expectedArray.Length, actualArray.Length, "The {0} arrays have different lengths", info.Name);

                        for (int i = 0; i < actualArray.Length; i++)
                        {
                            object expectedArrayValue = expectedArray.GetValue(i);
                            object actualArrayValue = actualArray.GetValue(i);

                            Assert.AreEqual(expectedArrayValue, actualArrayValue, "The {0} array has mismatching values at index {1}", new object[] { info.Name, i });
                        }
                    }

                    // else the field type is not an array
                    else
                    {
                        object[] args = new object[] { info.Name };
                        Assert.AreEqual(expectedValue.ToString(), actualValue.ToString(), "The {0} variable is not set correctly", args);
                    }
                }
                catch (NullReferenceException e)
                {
                    // If one of them throws an exception, then they should both be null ( or throw an exception ) 
                    Assert.Throws<NullReferenceException>(() => info.GetValue(expected).ToString(), "The exception is {0}", e.ToString() );
                    Assert.Throws<NullReferenceException>(() => info.GetValue(actual).ToString(), "{0} is assigned when it is expected to not be assigned", info.Name );
                   
                    // continue to the next field if the current one was never assigned a value
                    continue;
                }
            }
        }
    }
}