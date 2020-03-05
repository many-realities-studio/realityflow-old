using UnityEngine;


namespace RealityFlow.Plugin.Scripts
{

    [System.Serializable]
    public class FlowDevice
    {
        public string _id;
        public FlowTObject cameraOffset;
        public FlowTObject cameraRotation;
        public int resolutionX;
        public int resolutionY;
        public float dpi;
        public string deviceModel;
        public int deviceType;
        public string description;
        public string uid;

        [System.NonSerialized]
        public const int UNKNOWN = 0;
        [System.NonSerialized]
        public const int HANDHELD = 1;
        [System.NonSerialized]
        public const int DESKTOP = 3;

        public FlowDevice()
        {
            //deviceModel = SystemInfo.deviceModel;
            //switch (SystemInfo.deviceType)
            //{
            //    case DeviceType.Unknown:
            //        deviceType = UNKNOWN;
            //        break;
            //    case DeviceType.Handheld:
            //        deviceType = HANDHELD;
            //        break;
            //    case DeviceType.Desktop:
            //        deviceType = DESKTOP;
            //        break;
            //}
            //_id = SystemInfo.deviceUniqueIdentifier;
            //resolutionX = Screen.currentResolution.width;
            //resolutionY = Screen.currentResolution.height;
            //uid = "3";
            //dpi = Screen.dpi;
            //description = SystemInfo.deviceName;
            //cameraRotation = new FlowTObject(FlowCameras.mainCamera.gameObject);
        }
    }
}
