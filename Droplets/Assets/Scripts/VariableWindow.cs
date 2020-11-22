using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEditor;
public class VariableWindow : EditorWindow
{
        public string varTypeText = "Choose a variable type: ";
        public string varValueText = "Choose a variable value: ";
        string varName = "default";
        string varType = "BOOL";
        string varValue = "1.0";
 
        void OnGUI()
        {
            EditorGUILayout.LabelField("Choose a variable name:", EditorStyles.wordWrappedLabel);
            GUILayout.Space(10);
            varName = EditorGUILayout.TextField("Name: ", varName);
            GUILayout.Space(10);
            EditorGUILayout.LabelField("Choose a variable type:", EditorStyles.wordWrappedLabel);
            GUILayout.Space(10);
            varType = EditorGUILayout.TextField("Type: ", varType);
            GUILayout.Space(10);
            EditorGUILayout.LabelField("Choose a variable value:", EditorStyles.wordWrappedLabel);
            GUILayout.Space(10);
            varValue = EditorGUILayout.TextField("Value: ", varValue);
            this.Repaint();
            if(GUILayout.Button ("Confirm"))
                makeNewVar();
        }

        public void makeNewVar()
        {
            Vector2 pos = new Vector2(400.0f, 400.0f);
            Debug.Log("Creating new variable with name:"+this.varName+" Type:"+this.varType+" and Value:"+this.varValue);
            Variables newVar = new Variables(this.varName,this.varType,float.Parse(this.varValue), pos);
            VisualScriptingWindow.addVar(newVar);
            VisualScriptingWindow.addVarName(newVar.d_Name);
            Close();
        }
}
