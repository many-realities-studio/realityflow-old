using System;
using System.Collections.Generic;
using Dissonance.Networking;
using Photon.Realtime;

namespace Dissonance.Integrations.PhotonUnityNetworking2
{
    public class PhotonServer
        : BaseServer<PhotonServer, PhotonClient, int>, PhotonCommsNetwork.IPhotonPacketCallback, PhotonCommsNetwork.IPhotonDisconnectListener
    {
        private readonly PhotonCommsNetwork _network;

        private readonly Dictionary<int, RaiseEventOptions> _sendOptions = new Dictionary<int, RaiseEventOptions>();

        public PhotonServer(PhotonCommsNetwork network)
        {
            _network = network;
        }

        public override void Connect()
        {
            _network.RegisterPacketListener(_network.EventCodeToServer, this);
            _network.RegisterDisconnectListener(this);

            base.Connect();
        }

        public override void Disconnect()
        {
            _network.UnregisterPacketListener(this);
            _network.UnregisterDisconnectListener(this);

            base.Disconnect();
        }

        protected override void ReadMessages()
        {
            //Messages are received in an event handler, so we don't need to do any work to read events
        }

        public void PacketDelivered(byte eventcode, ArraySegment<byte> data, int senderid)
        {
            //Skip events we don't care about
            if (eventcode != _network.EventCodeToServer)
                return;

            NetworkReceivedPacket(senderid, data);
        }

        private RaiseEventOptions GetOptions(int connection)
        {
            lock (_sendOptions)
            {
                RaiseEventOptions val;
                if (!_sendOptions.TryGetValue(connection, out val))
                {
                    val = new RaiseEventOptions {
                        TargetActors = new int[] { connection }
                    };
                    _sendOptions.Add(connection, val);
                }

                return val;
            }
        }

        protected override void SendReliable(int connection, ArraySegment<byte> packet)
        {
            _network.Send(packet, _network.EventCodeToClient, GetOptions(connection), true);
        }

        protected override void SendUnreliable(int connection, ArraySegment<byte> packet)
        {
            _network.Send(packet, _network.EventCodeToClient, GetOptions(connection), false);
        }

        void PhotonCommsNetwork.IPhotonDisconnectListener.PeerDisconnected(Photon.Realtime.Player peer)
        {
            ClientDisconnected(peer.ActorNumber);
        }
    }
}
