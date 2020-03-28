//using RealityFlow.Plugin.Scripts.Events;
using System.Collections.Generic;
using System.IO;
using UnityEditor;
using UnityEngine;
using RealityFlow.Plugin.Scripts;

namespace RealityFlow.Plugin.Editor
{
    public class ConfirmationWindow : EditorWindow
    {
        static ConfirmationWindow window;

        // TODO: What does this do?
        public static void OpenWindow()
        {
            window = (ConfirmationWindow)GetWindow(typeof(ConfirmationWindow));
            window.minSize = new Vector2(200, 50);
            window.maxSize = new Vector2(200, 50);
            window.Show();
        }

        private void OnGUI()
        {
            DrawConfirm();
        }

        void DrawConfirm()
        {
            GUILayout.Label("Do you want to keep a \nlocal copy of this project?");

            EditorGUILayout.BeginHorizontal();
            if (GUILayout.Button("Confirm", GUILayout.Height(20)))
            {
                //ProjectFetchEvent project = new ProjectFetchEvent();
                //project.project = new FlowProject(Config.projectId);
                //project.objs = new List<FlowTObject>();
                //project.project.projectName = FlowProject.activeProject.projectName;
                //project.timestamp = System.DateTime.Now.Ticks;

                //foreach (FlowTObject obj in FlowProject.activeProject.transformsById.Values)
                //{
                //    obj.Read();
                //    project.objs.Add(obj);
                //}

                string path2 = "Assets/resources/projects/test.txt";

                StreamWriter writer = new StreamWriter(path2, true);
                //writer.WriteLine(JsonUtility.ToJson(project));
                writer.Close();

                window.Close();
            }
            if (GUILayout.Button("Cancel", GUILayout.Height(20)))
            {
                window.Close();
            }
            EditorGUILayout.EndHorizontal();
        }
    }
}
