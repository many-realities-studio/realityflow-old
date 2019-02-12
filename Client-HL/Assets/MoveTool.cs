using HoloToolkit.Unity.InputModule;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class MoveTool : MonoBehaviour, IFocusable, IInputHandler, ISourceStateHandler, IManipulationHandler {

    public Transform hostTransform;

    [Range(0.01f, 1.0f)]
    public float positionLerpSpeed = .2f;

    [Range(0.01f, 1.0f)]
    public float rotationLerpSpeed = .2f;

    public float distanceScale = 8f;

    public bool isDraggingEnabled = true;

    private bool isDragging;
    private bool isGazed;

    private Vector3 manipulationEventData;
    private Vector3 manipulationDelta;

    private Camera mainCamera;
    private IInputSource currentInputSource;
    private uint currentInputSourceId;

    // Use this for initialization
    void Start()
    {
        if(hostTransform == null)
        {
            hostTransform = transform;
        }

        mainCamera = Camera.main;
    }

    // Update is called once per frame
    void Update()
    {
        Quaternion currentRot = hostTransform.transform.rotation;

        if (NRSRManager.focusedObject != null)
        {
            hostTransform = NRSRManager.focusedObject.transform;
        }
        else
            return;

        if (isDraggingEnabled && isDragging)
            hostTransform.position = Vector3.Lerp(hostTransform.position, hostTransform.position + manipulationDelta, positionLerpSpeed);
    }

    public void startDragging()
    {
        if (!isDraggingEnabled || isDragging)
            return;

        NRSRManager.holdSelectedObject_UsingTransformTool = true;
    }

    public void stopDragging()
    {
        if(!isDragging)
        {
            NRSRManager.holdSelectedObject_UsingTransformTool = false;
            return;
        }

        isDragging = false;
        currentInputSource = null;
        InputManager.Instance.PopFallbackInputHandler();
    }

    public void OnFocusEnter()
    {
        Debug.Log("Gazing!!!!!!");
        if (isDraggingEnabled)
        {
            isGazed = true;
        }
    }

    public void OnFocusExit()
    {
        if (isDraggingEnabled)
            isGazed = false; 
    }

    public void OnInputDown(InputEventData eventData)
    {
        Debug.Log("input down!!!");
        if (isDragging ||
           // !eventData.InputSource.SupportsInputInfo(eventData.SourceId, SupportedInputInfo.Position) ||
            !isDraggingEnabled)
            return;

        InputManager.Instance.PushModalInputHandler(gameObject);

        Debug.Log("is dragging ");
        isDragging = true;
        currentInputSource = eventData.InputSource;
        currentInputSourceId = eventData.SourceId;
        startDragging();
    }

    public void OnInputUp(InputEventData eventData)
    {
        if (currentInputSource != null && eventData.SourceId == currentInputSourceId)
            stopDragging();
    }

    public void OnManipulationCanceled(ManipulationEventData eventData)
    {
        throw new System.NotImplementedException();
    }

    public void OnManipulationCompleted(ManipulationEventData eventData)
    {
        manipulationEventData = Vector3.zero;
        manipulationDelta = Vector3.zero;
    }

    public void OnManipulationStarted(ManipulationEventData eventData)
    {
        Debug.LogFormat("onManipulationStarted\r\nSource: {0} SourceId: {1}\r\nCumulativeDelta: {2} {3} {4}",
            eventData.InputSource,
            eventData.SourceId,
            eventData.CumulativeDelta.x,
            eventData.CumulativeDelta.y,
            eventData.CumulativeDelta.z);

        manipulationEventData = eventData.CumulativeDelta;
    }

    public void OnManipulationUpdated(ManipulationEventData eventData)
    {
        Debug.LogFormat("onManipulationUpdated\r\nSource: {0} SourceId: {1}\r\nCumulativeDelta: {2} {3} {4}",
            eventData.InputSource,
            eventData.SourceId,
            eventData.CumulativeDelta.x,
            eventData.CumulativeDelta.y,
            eventData.CumulativeDelta.z);

        Vector3 delta = eventData.CumulativeDelta - manipulationEventData;
        manipulationDelta = delta * distanceScale;
        Debug.LogFormat("moving: {1} {2} {3}", manipulationDelta.x, manipulationDelta.y, manipulationDelta.z);
        manipulationEventData = eventData.CumulativeDelta;
    }

    public void OnSourceDetected(SourceStateEventData eventData){}

    public void OnSourceLost(SourceStateEventData eventData)
    {
        if (currentInputSource != null && eventData.SourceId == currentInputSourceId)
            stopDragging();
    }

}
