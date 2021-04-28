using System;
using System.Collections;
using System.Collections.Generic;
using Photon.Pun;
using Photon.Realtime;
using UnityEngine;
using Packages.realityflow_package.Editor;

namespace Dissonance.Integrations.PhotonUnityNetworking2
{
    public class RFPun2Controller
        : MonoBehaviourPunCallbacks, ILobbyCallbacks, IMatchmakingCallbacks
    {
        // This script exists on an object in the scene to allow users to connect to Photon and to Photon rooms for Dissonance voice.
        // This is a custom script that was adapted from the Dissonance + Photon demo scene.

        private List<RoomInfo> _rooms = new List<RoomInfo>();

        RoomOptions roomOptions = new RoomOptions();

        private void Awake()
        {
            DontDestroyOnLoad(gameObject);
            var objs = FindObjectsOfType<RFPun2Controller>();
            if (objs.Length > 1)
                Destroy(gameObject);
        }

        private IEnumerator Start ()
        {
            // Connect to Photon on start.
            PhotonNetwork.NetworkStatisticsEnabled = true;
            PhotonNetwork.ConnectUsingSettings();

            //Wait until connected
            while (PhotonNetwork.NetworkClientState != ClientState.ConnectedToMasterServer)
                yield return true;
        }

        public override void OnEnable()
        {
            base.OnEnable();
            PhotonNetwork.AddCallbackTarget(this);

            // Subscribe to NewRealityFlowWindow events to let users join/leave rooms alongside RF projects.
            FlowNetworkManagerEditor.joinProjectEvent += OnJoinedRFProject;
            FlowNetworkManagerEditor.leaveProjectEvent += OnLeftRFProject;
            NewRealityFlowMenu.vrJoinProjectEvent += OnJoinedRFProject;
            NewRealityFlowMenu.vrLeaveProjectEvent += OnLeftRFProject;
        }

        public override void OnDisable()
        {
            PhotonNetwork.RemoveCallbackTarget(this);
            base.OnDisable();

            FlowNetworkManagerEditor.joinProjectEvent -= OnJoinedRFProject;
            FlowNetworkManagerEditor.leaveProjectEvent -= OnLeftRFProject;
        }

        void IMatchmakingCallbacks.OnJoinRandomFailed(short returnCode, string message)
        {
            Debug.LogError(string.Format("Failed to join photon room: '{0}'", message));

        }

        void IMatchmakingCallbacks.OnJoinRoomFailed(short returnCode, string message)
        {
            Debug.LogError(string.Format("Failed to join photon room: '{0}'", message));
        }

        public override void OnCreatedRoom()
        {
            Debug.Log("Created Photon room for other users to join.");
        }

        public override void OnJoinedRoom()
        {
            Debug.Log("Joined an existing Photon room.");
        }

        // These functions are called when a user joins a Reality Flow project. The Photon room code will be the same as the RF project code.
        private void OnJoinedRFProject(string rfProjectId)
        {
            roomOptions.IsVisible = false;

            PhotonNetwork.JoinOrCreateRoom(rfProjectId, roomOptions, TypedLobby.Default);
        }

        private void OnLeftRFProject()
        {
            PhotonNetwork.LeaveRoom();
        }
    }
}
