using UnityEngine;
using UnityEngine.UI;
using UnityEngine.EventSystems;
using TMPro;

namespace RealityFlow.Plugin.Scripts
{
    //[ExecuteInEditMode]
    public class DebugPanel : MonoBehaviour
    {
        public bool forceHolo;
        public bool forceWeb;
        public EventSystem evtSystemRef;
        public TextMeshProUGUI xValue;
        public TextMeshProUGUI yValue;
        public TextMeshProUGUI zValue;
        public TextMeshProUGUI exValue;
        public TextMeshProUGUI eyValue;
        public TextMeshProUGUI ezValue;
        public TextMeshProUGUI selectTransformLabel;
        public TextMeshProUGUI projectLabel;
        public TextMeshProUGUI stateLabel;
        public TextMeshProUGUI FOVLabel;
        public static DebugPanel instance;
        public GameObject clientIdentityValue;
        public Text connectionStatus;
        public GameObject masterButton;
        public GameObject fps_label;
        public Text latency;
        public Text identity;
        public Text client;
        float deltaTime = 0;

        //  HUD values for Ripple
        public Canvas DebugHUDCanvas;
        public Canvas DebugCanvas;
        public Text HUD_FPS;
        public Text HUD_ClientIdentity;
        //public TextMeshProUGUI HUD_SeebrightCamera;
        public TextMeshProUGUI HUD_ProjectLabel;

        void OnGUI()
        {
            int w = Screen.width, h = Screen.height;

            GUIStyle style = new GUIStyle();

            Rect rect = new Rect(0, 0, w, h * 2 / 100);
            style.alignment = TextAnchor.UpperLeft;
            style.fontSize = h * 2 / 100;
            style.normal.textColor = new Color(0.0f, 0.0f, 0.5f, 1.0f);
            float msec = deltaTime * 1000.0f;
            float fps = 1.0f / deltaTime;
            string text = string.Format("{0:0.0} ms ({1:0.} fps)", msec, fps);
            fps_label.GetComponent<TextMeshProUGUI>().text = text;
        }
        void Awake()
        {
            instance = this;
            gameObject.SetActive(true);
            //        DebugHUDCanvas.gameObject.SetActive(false);

        }

        void Start()
        {
            Debug.Log(FlowNetworkManager.clientType);
        }

        void Update()
        {
            deltaTime += (Time.deltaTime - deltaTime) * 0.1f;
        }

    }
}