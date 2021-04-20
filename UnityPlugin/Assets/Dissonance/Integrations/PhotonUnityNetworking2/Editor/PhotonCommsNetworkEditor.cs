using Dissonance.Editor;
using Dissonance.Integrations.PhotonUnityNetworking2;
using UnityEditor;
using UnityEngine;

namespace Dissonance.Integrations.PhotonUnityNetworking.Editor
{
    [CustomEditor(typeof(PhotonCommsNetwork))]
    public class PhotonCommsNetworkEditor
        : BaseDissonnanceCommsNetworkEditor<PhotonCommsNetwork, PhotonServer, PhotonClient, int, Unit, Unit>
    {
        private int _evCodeServer;
        private SerializedProperty _eventCodeToServerProperty;

        private int _evCodeClient;
        private SerializedProperty _eventCodeToClientProperty;

        private int _serializationCode;
        private SerializedProperty _serializationCodeProperty;

        protected void OnEnable()
        {
            _eventCodeToServerProperty = serializedObject.FindProperty("EventCodeToServer");
            _evCodeServer = _eventCodeToServerProperty.intValue;

            _eventCodeToClientProperty = serializedObject.FindProperty("EventCodeToClient");
            _evCodeClient = _eventCodeToClientProperty.intValue;

            _serializationCodeProperty = serializedObject.FindProperty("SerializationCode");
            _serializationCode = _serializationCodeProperty.intValue;
        }

        public override void OnInspectorGUI()
        {
            base.OnInspectorGUI();

            using (new EditorGUI.DisabledScope(Application.isPlaying))
            {
                serializedObject.Update();

                //Event Codes
                EditorGUILayout.HelpBox("Dissonance requires 2 Photon event codes. If you are not using PhotonNetwork.RaiseEvent you should use the default values.", MessageType.Info);
                _evCodeServer = EditorGUILayout.DelayedIntField("Event Code (To Server)", _evCodeServer);
                _evCodeClient = EditorGUILayout.DelayedIntField("Event Code (To Client)", _evCodeClient);
                if (_evCodeServer >= 200 || _evCodeClient >= 200)
                    EditorGUILayout.HelpBox("Event code must be less than 200", MessageType.Error);
                else if (_evCodeClient == _evCodeServer)
                    EditorGUILayout.HelpBox("Event codes must be unique", MessageType.Error);
                else
                {
                    _eventCodeToServerProperty.intValue = _evCodeServer;
                    _eventCodeToClientProperty.intValue = _evCodeClient;
                }

                //Serialization code
                EditorGUILayout.HelpBox("Dissonance requires a Photon type code. If you are not using PhotonPeer.RegisterType you should use the default value.", MessageType.Info);
                _serializationCode = EditorGUILayout.DelayedIntField("Type Code", _serializationCode);
                _serializationCodeProperty.intValue = _serializationCode;

                serializedObject.ApplyModifiedProperties();
            }
        }
    }
}