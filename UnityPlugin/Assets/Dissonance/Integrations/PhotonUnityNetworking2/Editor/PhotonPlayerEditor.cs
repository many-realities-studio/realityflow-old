using Dissonance.Editor;
using UnityEditor;
using UnityEngine;

namespace Dissonance.Integrations.PhotonUnityNetworking2.Editor
{
    public class PhotonPlayerEditor : MonoBehaviour
    {
        [CustomEditor(typeof(PhotonPlayer))]
        public class DissonancePlayerEditor
            : BaseIDissonancePlayerEditor
        {
        }
    }
}
