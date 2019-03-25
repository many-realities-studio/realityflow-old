using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class toggleButton : MonoBehaviour {

    private Button button;
    private Text text;
    private bool isPressed;
    public bool IsPressed
    {
        get { return isPressed; } 
        set { isPressed = value;  }
    }

    void Awake()
    {
        isPressed = true;
        changeState();
    }

    public void changeState()
    {
        text = GetComponentInChildren<Text>();
        if (text != null)
        {
            if (!isPressed)
            {
                GetComponent<Image>().color = Color.white;
                text.color = Color.black;
            }
            else
            {
                GetComponent<Image>().color = Color.gray;
                text.color = Color.white;
            }
            isPressed = !isPressed;
        }
    }
}
