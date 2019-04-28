using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using System;

// [ExecuteInEditMode]
public class DoOnMainThread : MonoBehaviour
{

    public readonly static Queue<Action> ExecuteOnMainThread = new Queue<Action>();

    public virtual void Update()
    {
        // dispatch stuff on main thread
        while (ExecuteOnMainThread.Count > 0)
        {
            ExecuteOnMainThread.Dequeue().Invoke();
        }
    }
}