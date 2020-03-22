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
    public Color pressedText;
    public Color unpressedText;
    public Color pressed;
    public Color unpressed;

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
                //GetComponent<Image>().color = Color.white;
                //text.color = Color.black;
                GetComponent<Image>().color = pressed;
                text.color = pressedText;
            }
            else
            {
                //GetComponent<Image>().color = Color.gray;
                //text.color = Color.white;
                GetComponent<Image>().color = unpressed;
                text.color = unpressedText;
            }
            isPressed = !isPressed;
        }
    }
}
