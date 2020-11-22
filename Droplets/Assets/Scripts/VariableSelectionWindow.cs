using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEditor;

public class VariableSelectionWindow : EditorWindow
{
        string[] opOptions = new string [6] {"==","!=",">","<",">=","<="};
        public static bool confirmed = false;
        int index1 = 1;
        int index2 = 1;
        int indexOp = 1;
        void OnGUI()
        {
            EditorGUILayout.LabelField("Choose variable 1:", EditorStyles.wordWrappedLabel);
            GUILayout.Space(10);
            index1 = EditorGUILayout.Popup(index1,VisualScriptingWindow.varNames.ToArray());
            GUILayout.Space(10);
            EditorGUILayout.LabelField("Choose variable 2:", EditorStyles.wordWrappedLabel);
            GUILayout.Space(10);
            index2 = EditorGUILayout.Popup(index2,VisualScriptingWindow.varNames.ToArray());
            GUILayout.Space(10);
            EditorGUILayout.LabelField("Choose operation:", EditorStyles.wordWrappedLabel);
            GUILayout.Space(10);
            indexOp = EditorGUILayout.Popup(indexOp,opOptions);
            this.Repaint();
            if(GUILayout.Button ("Confirm"))
            {
                Debug.Log("Confirm hit, index1 is "+index1+" index2 is "+index2+" indexOp is "+indexOp);
               confirmSelections(index1,index2,indexOp);
               confirmed = true;
            }
        }
        public void confirmSelections(int index1, int index2, int indexOp)
        {
            Variables var1 = new Variables("","",1, new Vector2(0.0f, 0.0f));
            Variables var2 = new Variables("","",1, new Vector2(0.0f, 0.0f));
            string op = "";
            op = opOptions[indexOp];
            for(int i = 0; i < VisualScriptingWindow.vars.Count; i++)
            {
                if(VisualScriptingWindow.vars[i].d_Name == VisualScriptingWindow.varNames.ToArray()[index1])
                {
                    var1 = VisualScriptingWindow.vars[i];
                    Debug.Log("After that var1 is "+var1.d_Name);
                }
                if(VisualScriptingWindow.vars[i].d_Name == VisualScriptingWindow.varNames.ToArray()[index2])
                {
                    var2 = VisualScriptingWindow.vars[i];
                    Debug.Log("After that var2 is "+var2.d_Name);
                }
            }
            VisualScriptingWindow.sendVars(var1,var2,op);
            Close();
        }
}
