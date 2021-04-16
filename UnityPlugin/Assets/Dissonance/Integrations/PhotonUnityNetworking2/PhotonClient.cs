using System;
using System.Collections.Generic;
using Dissonance.Networking;
using JetBrains.Annotations;
using Photon.Realtime;

namespace Dissonance.Integrations.PhotonUnityNetworking2
{
    public class PhotonClient
        : BaseClient<PhotonServer, PhotonClient, int>, PhotonCommsNetwork.IPhotonPacketCallback
    {
        #region field and properties
        private readonly PhotonCommsNetwork _network;

        private readonly RaiseEventOptions _sendOptions = new RaiseEventOptions {
            Receivers = ReceiverGroup.MasterClient
        };

        private readonly RaiseEventOptions _sendOptionsP2P = new RaiseEventOptions();

        private readonly List<int> _tmpDestinations = new List<int>();
        #endregion

        #region constructor
        public PhotonClient([NotNull] PhotonCommsNetwork network)
            : base(network)
        {
            _network = network;
        }
        #endregion

        public override void Connect()
        {
            _network.RegisterPacketListener(_network.EventCodeToClient, this);

            Connected();
        }

        public override void Disconnect()
        {
            _network.UnregisterPacketListener(this);

            base.Disconnect();
        }

        #region receive
        protected override void ReadMessages()
        {
            //Messages are received in an event handler, so we don't need to do any work to read events
        }

        public void PacketDelivered(byte eventcode, ArraySegment<byte> data, int senderid)
        {
            //Skip events we don't care about
            if (eventcode != _network.EventCodeToClient)
                return;

            var id = NetworkReceivedPacket(data);
            if (id.HasValue)
                ReceiveHandshakeP2P(id.Value, senderid);
        }
        #endregion

        #region send
        protected override void SendReliable(ArraySegment<byte> packet)
        {
            _network.Send(packet, _network.EventCodeToServer, _sendOptions, true);
        }

        protected override void SendUnreliable(ArraySegment<byte> packet)
        {
            _network.Send(packet, _network.EventCodeToServer, _sendOptions, false);
        }

        private void SendP2P([NotNull] IList<ClientInfo<int?>> destinations, ArraySegment<byte> packet, bool reliable)
        {
            //Build list of destinations and remove peers we can send to directly from the list
            for (var i = destinations.Count - 1; i >= 0; i--)
            {
                if (destinations[i].Connection.HasValue)
                {
                    _tmpDestinations.Add(destinations[i].Connection.Value);
                    destinations.RemoveAt(i);
                }
            }

            //Build the object to tell photon who to send to
            _sendOptionsP2P.TargetActors = _tmpDestinations.ToArray();
            _tmpDestinations.Clear();

            //send it
            _network.Send(packet, _network.EventCodeToClient, _sendOptionsP2P, reliable);
        }

        protected override void SendReliableP2P(List<ClientInfo<int?>> destinations, ArraySegment<byte> packet)
        {
            SendP2P(destinations, packet, true);

            //Call base to send to all the rest of the peers via server relay
            base.SendReliableP2P(destinations, packet);
        }

        protected override void SendUnreliableP2P(List<ClientInfo<int?>> destinations, ArraySegment<byte> packet)
        {
            SendP2P(destinations, packet, false);

            //Call base to send to all the rest of the peers via server relay
            base.SendUnreliableP2P(destinations, packet);
        }
        #endregion

        #region p2p handshaking
        protected override void OnServerAssignedSessionId(uint session, ushort id)
        {
            base.OnServerAssignedSessionId(session, id);

            //Broadcast a handshake to everyone else
            _network.Send(new ArraySegment<byte>(WriteHandshakeP2P(session, id)), _network.EventCodeToClient, new RaiseEventOptions
            {
                Receivers = ReceiverGroup.Others,
            }, true);
        }
        #endregion
    }
}
