using JetBrains.Annotations;
using Photon.Pun;
using UnityEngine;

namespace Dissonance.Integrations.PhotonUnityNetworking2.Demo
{
    public class PlayerSpawner
        : MonoBehaviour
    {
        [UsedImplicitly] public GameObject ObjectToSpawn;

        [UsedImplicitly] private void Start()
        {
            var rand = new System.Random();
            var pos = new Vector3(rand.Next(-15, 15), 0, rand.Next(-15, 15));

            PhotonNetwork.Instantiate(ObjectToSpawn.name, pos, Quaternion.identity, 0);

            Destroy(gameObject);
        }
    }
}
