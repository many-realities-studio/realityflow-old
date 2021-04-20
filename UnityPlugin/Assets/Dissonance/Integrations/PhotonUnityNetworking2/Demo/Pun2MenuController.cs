using System;
using System.Collections;
using System.Collections.Generic;
using Photon.Pun;
using Photon.Realtime;
using UnityEngine;

namespace Dissonance.Integrations.PhotonUnityNetworking2.Demo
{
    public class Pun2MenuController
        : MonoBehaviourPunCallbacks, ILobbyCallbacks, IMatchmakingCallbacks
    {
        private string _guiCreateNamedRoomName = Guid.NewGuid().ToString().Substring(0, 10);

        private List<RoomInfo> _rooms = new List<RoomInfo>();

        private State _state;
        private enum State
        {
            Connecting,
            ServerList,
            JoiningRoom,
            CreatingRoom,
            InRoom
        }

        [SerializeField] public string SceneName = "PUN2 Game World";

        private void Awake()
        {
            DontDestroyOnLoad(gameObject);
            var objs = FindObjectsOfType<Pun2MenuController>();
            if (objs.Length > 1)
                Destroy(gameObject);
        }

        private IEnumerator Start ()
        {
            PhotonNetwork.NetworkStatisticsEnabled = true;
            PhotonNetwork.ConnectUsingSettings();

            _state = State.Connecting;

            //Wait until connected
            while (PhotonNetwork.NetworkClientState != ClientState.ConnectedToMasterServer)
                yield return true;

            PhotonNetwork.JoinLobby();

            _state = State.ServerList;
        }

        public override void OnEnable()
        {
            base.OnEnable();
            PhotonNetwork.AddCallbackTarget(this);
        }

        public override void OnDisable()
        {
            PhotonNetwork.RemoveCallbackTarget(this);
            base.OnDisable();
        }

        void ILobbyCallbacks.OnRoomListUpdate(List<RoomInfo> roomList)
        {
            _rooms = roomList;
            Debug.Log("Received Photon Room List");
        }

        void IMatchmakingCallbacks.OnJoinRandomFailed(short returnCode, string message)
        {
            Debug.LogError(string.Format("Failed to join photon room: '{0}'", message));

            _state = State.ServerList;
        }

        void IMatchmakingCallbacks.OnJoinRoomFailed(short returnCode, string message)
        {
            Debug.LogError(string.Format("Failed to join photon room: '{0}'", message));

            _state = State.ServerList;
        }

        public override void OnJoinedRoom()
        {
            PhotonNetwork.LoadLevel(SceneName ?? "PUN2 Game World");
            _state = State.InRoom;
        }

        private void OnGUI()
        {
            using (new GUILayout.AreaScope(new Rect(10, 10, 250, Screen.height - 20)))
            {
                switch (_state)
                {
                    case State.Connecting:
                        GUILayout.Label("Connecting To Photon Servers...");
                        break;

                    case State.ServerList:
                        ServerListGUI();
                        break;

                    case State.JoiningRoom:
                        GUILayout.Label("Joining Room...");
                        break;

                    case State.CreatingRoom:
                        GUILayout.Label("Creating Room...");
                        break;

                    case State.InRoom:
                        InRoomGUI();
                        break;

                    default:
                        throw new ArgumentOutOfRangeException();
                }
            }
        }

        private void InRoomGUI()
        {
            if (GUILayout.Button(new GUIContent("Exit Room")))
            {
                PhotonNetwork.LeaveRoom();
                PhotonNetwork.LoadLevel("PUN2 Demo");
                _state = State.ServerList;
                _guiCreateNamedRoomName = Guid.NewGuid().ToString().Substring(0, 10);
            }
        }

        private void ServerListGUI()
        {
            using (new GUILayout.VerticalScope())
            {
                if (GUILayout.Button(new GUIContent("Join Random Room")))
                {
                    PhotonNetwork.JoinRandomRoom();
                    _state = State.JoiningRoom;
                }

                using (new GUILayout.HorizontalScope())
                {
                    _guiCreateNamedRoomName = GUILayout.TextField(_guiCreateNamedRoomName);

                    if (GUILayout.Button(new GUIContent("Create New Room")))
                    {
                        PhotonNetwork.CreateRoom(_guiCreateNamedRoomName);
                        _state = State.CreatingRoom;
                    }
                }

                if (_rooms.Count > 0)
                {
                    GUILayout.Label(string.Format("Available Rooms ({0}):", _rooms.Count));
                    for (var i = 0; i < _rooms.Count; i++)
                    {
                        if (!_rooms[i].IsOpen)
                            continue;

                        var join = GUILayout.Button(string.Format(" - {0}", _rooms[i].Name));
                        if (join)
                        {
                            PhotonNetwork.JoinRoom(_rooms[i].Name);
                            _state = State.JoiningRoom;
                        }
                    }
                }
            }
        }
    }
}
