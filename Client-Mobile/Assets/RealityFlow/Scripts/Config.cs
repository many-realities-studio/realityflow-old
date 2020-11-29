using RealityFlow.Plugin.Scripts;
using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

namespace MobileConfiguration
{
    public static class Config
    {

        public static string CurrentSelectedObjectId { get; set; } = null;
        public static bool LeftProject { get; set; } = false;
        public static List<FlowProject> projects { get; set; } = new List<FlowProject>();
        public static string ProjectToLoadId { get; set; } = null;
        public static bool LoginError { get; set; } = false;


    }
}